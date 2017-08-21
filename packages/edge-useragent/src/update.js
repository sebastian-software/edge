/**
 * Build in Native modules.
 */
import path from "path"

import fs from "fs"
import vm from "vm"
import tmp from "tmp"

/**
 * Third party modules.
 */
import request from "request"

import yaml from "yamlparser"

/**
 * Update the regexp.js file
 *
 * @param {Function} callback Completion callback.
 * @api public
 */
export function update(callback) {
  // Prepend local additions that are missing from the source
  fs.readFile(before, "utf8", function reading(err, before) {
    if (err) return callback(err)

    // Fetch the remote resource as that is frequently updated
    request(remote, function downloading(err, res, remote) {
      if (err) return callback(err)
      if (res.statusCode !== 200)
        return callback(new Error("Invalid statusCode returned"))

      // Append get some local additions that are missing from the source
      fs.readFile(after, "utf8", function reading(err, after) {
        if (err) return callback(err)

        // Parse the contents
        parse([before, remote, after], function parsing(
          err,
          results,
          source
        ) {
          callback(err, results)

          if (!source || err) return

          //
          // Save to a tmp file to avoid potential concurrency issues.
          //
          tmp.file((err, tempFilePath) => {
            if (err) return

            fs.writeFile(tempFilePath, source, function idk(err) {
              if (err) return

              fs.rename(tempFilePath, output, err => {})
            })
          })
        })
      })
    })
  })
}

/**
 * Parse the given sources.
 *
 * @param {Array} sources String versions of the source
 * @param {Function} callback completion callback
 * @api public
 */
export function parse(sources, callback) {
  const results = {}

  const data = sources.reduce(function parser(memo, data) {
    // Try to repair some of the odd structures that are in the yaml files
    // before parsing it so we generate a uniform structure:

    // Normalize the Operating system versions:
    data = data.replace(/os_v([1-3])_replacement/gim, function replace(
      match,
      version
    ) {
      return `v${version}_replacement`
    })

    // Make sure that we are able to parse the yaml string
    try {
      data = yaml.eval(data)
    } catch (e) {
      callback(e)
      callback = null
      return memo
    }

    // merge the data with the memo;
    Object.keys(data).forEach(key => {
      const results = data[key]
      memo[key] = memo[key] || []

      for (let i = 0, l = results.length; i < l; i++) {
        memo[key].push(results[i])
      }
    })

    return memo
  }, {})

  ;[
    {
      resource: "user_agent_parsers",
      replacement: "family_replacement",
      name: "browser"
    },
    {
      resource: "device_parsers",
      replacement: "device_replacement",
      name: "device"
    },
    {
      resource: "os_parsers",
      replacement: "os_replacement",
      name: "os"
    }
  ].forEach(function parsing(details) {
    results[details.resource] = results[details.resource] || []

    const resources = data[details.resource]
    const name = details.resource.replace("_parsers", "")
    let resource
    let parser

    for (let i = 0, l = resources.length; i < l; i++) {
      resource = resources[i]

      // We need to JSON stringify the data to properly add slashes escape other
      // kinds of crap in the RegularExpression. If we don't do thing we get
      // some illegal token warnings.
      parser = `${details.name}[${i}] = [`
      parser += `new RegExp(${JSON.stringify(resource.regex)}),`

      // Check if we have replacement for the parsed family name
      if (resource[details.replacement]) {
        parser += `"${resource[details.replacement].replace(
          '"',
          '\\"'
        )}",`
      } else {
        parser += "0,"
      }

      if (resource.v1_replacement) {
        parser += `"${resource.v1_replacement.replace(
          '"',
          '\\"'
        )}",`
      } else {
        parser += "0,"
      }

      if (resource.v2_replacement) {
        parser += `"${resource.v2_replacement.replace(
          '"',
          '\\"'
        )}",`
      } else {
        parser += "0,"
      }

      if (resource.v3_replacement) {
        parser += `"${resource.v3_replacement.replace(
          '"',
          '\\"'
        )}"`
      } else {
        parser += "0"
      }

      parser += "];\n"
      results[details.resource].push(parser)
    }
  })

  // Generate a correct format
  generate(results, callback)
}

/**
 * Generate the regular expressions file source code.
 *
 * @param {Object} results The parsed result of the regexp.yaml.
 * @param {Function} callback Completion callback
 * @api public
 */
export function generate(results, callback) {
  const regexps = [
    LEADER,
    "var parser;",
    "var browser = [];",
    results.user_agent_parsers.join("\n"),
    //`browser.length = ${results.user_agent_parsers.length};`,

    "var device = [];",
    results.device_parsers.join("\n"),
    //`device.length = ${results.device_parsers.length};`,

    "var os = [];",
    results.os_parsers.join("\n"),
    //`os.length = ${results.os_parsers.length};`,

    "export { browser, device, os };"
  ].join("\n\n")

  callback(undefined, null, regexps)
}

/**
 * The location of the ua-parser regexes yaml file.
 *
 * @type {String}
 * @api private
 */
export const remote =
  "https://raw.githubusercontent.com/ua-parser/uap-core/master/regexes.yaml"

/**
 * The locations of our local regexes yaml files.
 *
 * @type {String}
 * @api private
 */
export const before = path.resolve(
  __dirname,
  "..",
  "static",
  "user_agent.before.yaml"
)

export const after = path.resolve(
  __dirname,
  "..",
  "static",
  "user_agent.after.yaml"
)

/**
 * The the output location for the generated regexps file
 *
 * @type {String}
 * @api private
 */
export const output = path.resolve(__dirname, "regexps.js")

/**
 * The leader that needs to be added so people know they shouldn't touch all the
 * things.
 *
 * @type {String}
 * @api private
 */
export const LEADER = `
/**
 * TL;DR: Don't touch this.
 *
 * DO NOT EDIT THIS FILE, IT IS AUTOMATICALLY GENERATED AND COMPILED FROM AN
 * EXTERNAL REGEXPS DATABASE.
 */
`
