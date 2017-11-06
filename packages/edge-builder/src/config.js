import { relative, resolve } from "path"
import cosmiconfig from "cosmiconfig"
import { get as getRoot } from "app-root-dir"
import { set } from "lodash"
import toBool from "yn"
import jsome from "jsome"

// Export common understanding of what ROOT is
export const ROOT = getRoot()

const appPkg = require(`${ROOT}/package.json`)

export const NAME = appPkg.name
export const VERSION = appPkg.version
export const LOGPREFIX = `${NAME}-${VERSION}:`

export const SCHEMA = {
  verbose: {
    type: "boolean",
    default: false
  },

  quiet: {
    type: "boolean",
    default: false
  },

  entry: {
    serverMain: {
      type: "path",
      default: "src/server/index.js"
    },
    clientMain: {
      type: "path",
      default: "src/client/index.js"
    },
    serverVendor: {
      type: "path",
      default: "src/server/vendor.js"
    },
    clientVendor: {
      type: "path",
      default: "src/server/vendor.js"
    }
  },

  output: {
    server: {
      type: "path",
      default: "build/server"
    },
    client: {
      type: "path",
      default: "build/client"
    },
    public: {
      type: "url",
      default: "/static/"
    }
  },

  build: {
    enableSourceMaps: {
      type: "boolean",
      default: true
    },
    bundleCompression: {
      type: "string",
      default: "uglify"
    },
    useCacheLoader: {
      type: "boolean",
      default: true
    },
    babelEnvPrefix: {
      type: "string",
      default: "edge"
    }
  },

  locale: {
    default: {
      type: "string",
      default: "en-US"
    },
    supported: {
      type: "array",
      default: [ "en-US", "es-ES", "de-DE" ]
    }
  },

  hook: {
    webpack: {
      type: "script",
      default: "hooks/webpack.js"
    }
  }
}

export async function loadConfig(prefix = "edge", flags = {}) {
  // Read edge configuration
  const configLoader = cosmiconfig(prefix, {
    // allow extensions on rc files
    rcExtensions: true,

    // Force stop at project root folder
    stopDir: ROOT
  })

  var configResult

  try {
    configResult = await configLoader.load(ROOT)
  } catch (parsingError) {
    throw new Error(`Error parsing config file: ${parsingError}. Root: ${ROOT}.`)
  }

  const config = configResult.config

  for (let key in flags) {
    set(config, key, flags[key])
  }

  await processConfig(config, SCHEMA)

  const configRoot = relative(ROOT, configResult.filepath)

  if (config.verbose) {
    console.log(`Configuration from ${configRoot}:`)
    jsome(config)
  }

  return {
    config,
    root: configRoot
  }
}

async function processConfig(config, schema) {
  for (const key in schema) {
    const specs = schema[key]
    const value = config[key] || {}

    if (specs.type == null) {
      config[key] = (await processConfig(value, specs)) || value
    } else {
      config[key] = await processEntry(value, specs)
    }
  }
}

const identityFnt = (item) => item

/* eslint-disable complexity */
async function processEntry(value, specs) {
  let parsed

  switch (specs.type) {
    case "string":
      if (typeof value !== "string") {
        throw new Error("Invalid config value for type string!")
      }
      return String(value)

    case "number":
      parsed = parseFloat(value, 10)
      if (isNaN(parsed)) {
        throw new Error("Invalid config value for type number!")
      }
      return parsed

    case "boolean":
      return toBool(value)

    case "path":
      if (typeof value !== "string") {
        throw new Error("Invalid config value for type path (string required)!")
      }
      return resolve(ROOT, value)

    case "url":
      if (typeof value !== "string") {
        throw new Error("Invalid config value for type url (string required)!")
      }
      return value

    case "array":
      if (!(value instanceof Array)) {
        throw new Error("Invalid config value for type array!")
      }
      return value

    case "script":
      try {
        parsed = await import(resolve(ROOT, value))
      } catch (err) {
        parsed = null
      }

      return parsed ? parsed.default || parsed : identityFnt

    default:
      throw new Error(`Unsupported entry type in config ${specs.type}!`)
  }
}
