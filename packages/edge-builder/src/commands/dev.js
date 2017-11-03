/* eslint-disable no-console */

import formatWebpackMessages from "react-dev-utils/formatWebpackMessages"
import chalk from "chalk"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import webpackHotServerMiddleware from "webpack-hot-server-middleware"
import { createExpressServer } from "edge-express"

import configBuilder from "../builder"

export function create(config = {}) {
  const clientConfig = configBuilder("client", "development", config)
  const serverConfig = configBuilder("server", "development", config)

  const multiCompiler = webpack([ clientConfig, serverConfig ])
  const clientCompiler = multiCompiler.compilers[0]

  const devMiddleware = webpackDevMiddleware(multiCompiler, {
    // required
    publicPath: config.output.public,

    // we have our custom error handling for webpack which offers far better DX
    quiet: true,

    // display no info to console (only warnings and errors)
    noInfo: true
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

export function connect(server, multiCompiler) {
  let serverIsStarted = false

  multiCompiler.plugin("invalid", () => {
    console.log("[EDGE] Compiling...")
  })

  multiCompiler.plugin("done", (stats) => {
    const rawMessages = stats.toJson({})
    const messages = formatWebpackMessages(rawMessages)

    const isSuccessful = !messages.errors.length && !messages.warnings.length
    if (isSuccessful) {
      console.log(chalk.green("[EDGE] Compiled successfully!"))
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.red("[EDGE] Failed to compile.\n"))
      console.log(messages.errors.join("\n\n"))
      return
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow("[EDGE] Compiled with warnings.\n"))
      console.log(messages.warnings.join("\n\n"))
    }

    if (!stats.hasErrors() && !serverIsStarted) {
      serverIsStarted = true

      server.listen(process.env.SERVER_PORT, () => {
        console.log(`[EDGE] Development Server started @ Port ${process.env.SERVER_PORT}`)
      })
    }
  })
}

export function start(config = {}) {
  const { middleware, multiCompiler } = create(config)

  const server = createExpressServer({
    staticConfig: {
      public: config.output.public,
      path: config.output.client
    },
    localeConfig: config.locale,
    afterSecurity: [],
    beforeFallback: [ ...middleware ],
    enableCSP: process.env.ENABLE_CSP !== "false",
    enableNonce: process.env.ENABLE_NONCE !== "false"
  })

  connect(server, multiCompiler)
}
