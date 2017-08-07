import runSequence from "run-sequence"
import { addDevMiddleware } from "./express/dev"
import dotenv from "dotenv"
import notifier from "node-notifier"
import chalk from "chalk"

import { cleanClient, cleanServer, buildClient, buildServer } from "./commands/build"
import { startDevServer } from "./commands/dev"

// Initialize environment configuration
dotenv.config()

export {
  addDevMiddleware,
  cleanClient, cleanServer, buildClient, buildServer,
  startDevServer
}

export function createNotification(options)
{
  const title = `${options.title}`

  if (options.notify) {
    notifier.notify({
      title,
      message: options.message
    })
  }

  const level = options.level || "info"
  const message = `${chalk.bold(title)}: ${options.message}`

  switch (level) {
    case "warn":
      console.log(chalk.yellow(message))
      break

    case "error":
      console.log(chalk.bgRed.white(message))
      break

    case "info":
    default:
      console.log(message)
  }
}
