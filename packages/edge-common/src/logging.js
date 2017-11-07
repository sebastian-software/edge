import chalk from "chalk"
import notifier from "node-notifier"

import { NAME, VERSION } from "./config"

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

  /* eslint-disable no-console */
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
