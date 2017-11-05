import { relative } from "path"
import jsome from "jsome"
import { load, ROOT } from "./config"

/* eslint-disable no-console */

export async function getConfig(flags) {
  const { config, root } = await load("edge", flags)

  console.log(`Loaded config from ${root}.`)

  if (config.verbose) {
    console.log("Configuration:")
    jsome(config)
  }

  return config
}
