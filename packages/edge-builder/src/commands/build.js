import webpack from "webpack"
import { remove } from "fs-extra"
import { promisify } from "bluebird"
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages"

import builder from "../builder"
import { notify } from "../common"

const removePromise = promisify(remove)

export function buildClient(config = {}) {
  const webpackConfig = builder("client", "production", config)

  return new Promise((resolve, reject) => {
    /* eslint-disable no-console */
    webpack(webpackConfig, (fatalError, stats) => {
      if (fatalError) {
        notify(`Fatal error during compiling client: ${fatalError}`, "error")
        return reject()
      }

      const rawMessages = stats.toJson({})
      const messages = formatWebpackMessages(rawMessages)

      const isSuccessful = !messages.errors.length && !messages.warnings.length
      if (isSuccessful) {
        notify("Compiled client successfully!", "info")
      }

      // If errors exist, only show errors.
      if (messages.errors.length) {
        notify("Failed to compile client!", "error")
        console.log(messages.errors.join("\n\n"))
        return reject()
      }

      return resolve()
    })
  })
}

export function buildServer(config = {}) {
  const webpackConfig = builder("server", "production", config)

  return new Promise((resolve, reject) => {
    /* eslint-disable no-console */
    webpack(webpackConfig, (fatalError, stats) => {
      if (fatalError) {
        notify(`Fatal error during compiling server: ${fatalError}`, "error")
        return reject()
      }

      const rawMessages = stats.toJson({})
      const messages = formatWebpackMessages(rawMessages)

      const isSuccessful = !messages.errors.length && !messages.warnings.length
      if (isSuccessful) {
        notify("Compiled server successfully!", "info")
      }

      // If errors exist, only show errors.
      if (messages.errors.length) {
        notify("Failed to compile server!", "error")
        console.log(messages.errors.join("\n\n"))
        return reject()
      }

      return resolve()
    })
  })
}

export function cleanServer(config = {}) {
  return removePromise("./build/server")
}

export function cleanClient(config = {}) {
  return removePromise("./build/client")
}
