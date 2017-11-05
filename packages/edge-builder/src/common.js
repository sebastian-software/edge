import cosmiconfig from "cosmiconfig"
import { get as getRoot } from "app-root-dir"
import { relative, resolve, join } from "path"
import chalk from "chalk"
import { get, set, defaultsDeep } from "lodash"
import jsome from "jsome"

import defaultConfig from "./defaultConfig"

/* eslint-disable no-process-exit, no-console */

// Export common understanding of what ROOT is
export const ROOT = getRoot()

const SCHEMA = {
  "entry.serverMain": {
    type: "path",
    default: "src/server/index.js"
  },
  "entry.clientMain": {
    type: "path",
    default: "src/client/index.js"
  },
  "entry.serverVendor": {
    type: "path",
    default: "src/server/vendor.js"
  },
  "entry.clientVendor": {
    type: "path",
    default: "src/server/vendor.js"
  },

  "output.server": {
    type: "path",
    default: "build/server"
  },
  "output.client": {
    type: "path",
    default: "build/client"
  },

  "hook.webpack" : {
    type: "script",
    default: "hooks/webpack.js"
  }
}

// Read edge configuration
const configLoader = cosmiconfig("edge", {
  // allow extensions on rc files
  rcExtensions: true,

  // Force stop at project root folder
  stopDir: ROOT
})

export async function getConfig(flags) {
  var config
  var filepath

  try {
    { config, filepath } = await configLoader.load(ROOT)
  } catch (parsingError) {
    throw new Error(`Error parsing config file: ${parsingError}. Root: ${ROOT}.`)
  }

  console.log(`Loaded config from ${relative(ROOT, configResult.filepath)}`)

  for (let key in flags) {
    set(config, key, flags[key])
  }

  const mergedConfig = defaultsDeep(config, defaultConfig)

  if (flags.verbose) {
    console.log("Configuration:")
    jsome(config)
  }

  resolvePathsInConfig(mergedConfig, ROOT)

  return config
}

function resolvePathsInConfig(config) {
  RESOLVE_PATH_FOR.forEach((entry) => {
    if (get(config, entry) != null) {
      set(config, entry, resolve(ROOT, get(config, entry)))
    }
  })

  return config
}
