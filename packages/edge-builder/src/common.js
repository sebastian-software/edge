import jsome from "jsome"
import { load } from "./config"

/* eslint-disable no-console */
export async function getConfig(flags) {
  const { config, root } = await load("edge", flags)

  console.log(`[EDGE] Loaded config from ${root}`)

  if (config.verbose) {
    console.log("[EDGE] Configuration:")
    jsome(config)
  }

  return config
}
