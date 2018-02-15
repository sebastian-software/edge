import formatWebpackMessages from "react-dev-utils/formatWebpackMessages"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import webpackHotServerMiddleware from "webpack-hot-server-middleware"
import { notify } from "edge-common"

import configBuilder from "../builder"

export function createMiddleware(config = {}) {
  const clientConfig = configBuilder("client", "development", config)
  const serverConfig = configBuilder("server", "development", config)

  const multiCompiler = webpack([ clientConfig, serverConfig ])
  const clientCompiler = multiCompiler.compilers[0]

  const devMiddleware = webpackDevMiddleware(multiCompiler, {
    // required
    publicPath: config.output.public,

    // we have our custom error handling for webpack which offers far better DX
    logLevel: "silent"
  })

  const hotMiddleware = webpackHotMiddleware(clientCompiler)

  // keeps serverRender updated with arg: { clientStats, outputPath }
  const hotServerMiddleware = webpackHotServerMiddleware(multiCompiler, {
    serverRendererOptions: {
      outputPath: config.output.client
    }
  })

  return {
    middleware: [ devMiddleware, hotMiddleware, hotServerMiddleware ],
    multiCompiler
  }
}

export function connectWithWebpack(server, multiCompiler) {
  let serverIsStarted = false

  multiCompiler.plugin("invalid", () => {
    notify("Compiling...", "info")
  })

  multiCompiler.plugin("done", (stats) => {
    /* eslint-disable no-console */
    const rawMessages = stats.toJson({})
    const messages = formatWebpackMessages(rawMessages)

    const isSuccessful = !messages.errors.length && !messages.warnings.length
    if (isSuccessful) {
      notify("Compiled successfully!", "info")
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      notify("Failed to compile!", "error")
      console.log(messages.errors.join("\n\n"))
      return
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      notify("Compiled with warnings!", "warn")
      console.log(messages.warnings.join("\n\n"))
    }

    if (!stats.hasErrors() && !serverIsStarted) {
      serverIsStarted = true

      server.listen(process.env.SERVER_PORT, () => {
        notify(`Server started at port ${process.env.SERVER_PORT}`, "info")
      })
    }
  })
}
