import jsome from "jsome"
import chalk from "chalk"
import notifier from "node-notifier"

import { load, NAME, VERSION } from "./config"

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

export function colorize(message, level = null) {
  switch (level) {
    case "warn":
      return chalk.yellow(message)

    case "error":
      return chalk.red(message)

    case "info":
      return chalk.green(message)

    default:
      return message
  }
}

export function notify(message, level = null) {
  notifier.notify({
    title: `${NAME}-${VERSION}`,
    message
  })

  const consoleMessage = `${chalk.bold(NAME)}: ${colorize(message, level)}`
  switch (level) {
    case "warn":
      console.warn(consoleMessage)
      break

    case "error":
      console.error(consoleMessage)
      break

    case "info":
      console.log(consoleMessage)
      break

    default:
      console.log(consoleMessage)
  }
}
