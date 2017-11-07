import webpack from "webpack"
import { remove } from "fs-extra"
import { promisify } from "bluebird"
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages"
import { notify } from "edge-common"

import builder from "../builder"

const removePromise = promisify(remove)

/* eslint-disable no-console, max-params */
function getWebpackHandler(target, resolve, reject) {
  return (fatalError, stats) => {
    if (fatalError) {
      notify(`Fatal error during compiling ${target}: ${fatalError}`, "error")
      return reject()
    }

    const rawMessages = stats.toJson({})
    const messages = formatWebpackMessages(rawMessages)

    const isSuccessful = !messages.errors.length && !messages.warnings.length
    if (isSuccessful) {
      notify(`Compiled ${target} successfully!`, "info")
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      notify(`Failed to compile ${target}!`, "error")
      console.log(messages.errors.join("\n\n"))
      return reject()
    }

    return resolve()
  }
}

export function buildClient(config = {}) {
  const webpackConfig = builder("client", "production", config)

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, getWebpackHandler("client", resolve, reject))
  })
}

export function buildServer(config = {}) {
  const webpackConfig = builder("server", "production", config)

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, getWebpackHandler("server", resolve, reject))
  })
}

export function cleanServer(config = {}) {
  return removePromise(config.output.server)
}

export function cleanClient(config = {}) {
  return removePromise(config.output.client)
}
