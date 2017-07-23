import webpack from "webpack"
import { remove } from "fs-extra"
import { promisify } from "bluebird"
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages"
import chalk from "chalk"

import builder from "../builder"

const removePromise = promisify(remove)

export function buildClient()
{
  const config = builder({
    target: "client",
    env: "production"
  })

  return new Promise((resolve, reject) =>
  {
    /* eslint-disable no-console */
    webpack(config, (fatalError, stats) =>
    {
      if (fatalError) {
        const fatalMsg = `Fatal error during compiling client: ${fatalError}`
        console.log(chalk.red(fatalMsg))
        return reject(fatalMsg)
      }

      const rawMessages = stats.toJson({})
      const messages = formatWebpackMessages(rawMessages)

      const isSuccessful = !messages.errors.length && !messages.warnings.length
      if (isSuccessful) {
        console.log(chalk.green("Compiled client successfully!"))
      }

      // If errors exist, only show errors.
      if (messages.errors.length) {
        console.log(chalk.red("Failed to compile client!\n"))
        console.log(messages.errors.join("\n\n"))
        return reject("Failed to compile client!")
      }

      return resolve(true)
    })
  })
}

export function buildServer() {
  const config = builder({
    target: "server",
    env: "production"
  })

  return new Promise((resolve, reject) => {
    /* eslint-disable no-console */
    webpack(config, (fatalError, stats) => {
      if (fatalError) {
        const fatalMsg = `Fatal error during compiling server: ${fatalError}`
        console.log(chalk.red(fatalMsg))
        return reject(fatalMsg)
      }

      const rawMessages = stats.toJson({})
      const messages = formatWebpackMessages(rawMessages)

      const isSuccessful = !messages.errors.length && !messages.warnings.length
      if (isSuccessful) {
        console.log(chalk.green("Compiled server successfully!"))
      }

      // If errors exist, only show errors.
      if (messages.errors.length) {
        console.log(chalk.red("Failed to compile server!\n"))
        console.log(messages.errors.join("\n\n"))
        return reject("Failed to compile server!")
      }

      return resolve(true)
    })
  })
}

export function cleanServer() {
  return removePromise("./build/server")
}

export function cleanClient() {
  return removePromise("./build/client")
}
