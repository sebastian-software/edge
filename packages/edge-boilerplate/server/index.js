import express from "express"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import webpackHotServerMiddleware from "webpack-hot-server-middleware"
import { CLIENT_OUTPUT, PUBLIC_PATH, DEVELOPMENT_PORT, PRODUCTION_PORT } from "../config"
import configBuilder from "../webpack/builder"

const server = express()

if (process.env.NODE_ENV === "development") {

  const clientConfig = configBuilder({
    target: "client",
    env: process.env.NODE_ENV
  })
  const serverConfig = configBuilder({
    target: "server",
    env: process.env.NODE_ENV
  })

  const multiCompiler = webpack([ clientConfig, serverConfig ])
  const clientCompiler = multiCompiler.compilers[0]

  server.use(webpackDevMiddleware(multiCompiler, {
    // required
    publicPath: PUBLIC_PATH,

    // display no info to console (only warnings and errors)
    noInfo: true
  }))

  server.use(webpackHotMiddleware(clientCompiler))

  // keeps serverRender updated with arg: { clientStats, outputPath }
  server.use(webpackHotServerMiddleware(multiCompiler, {
    serverRendererOptions: {
      outputPath: CLIENT_OUTPUT
    }
  }))

  server.listen(DEVELOPMENT_PORT, () => {})
}
else
{
  const clientStats = require("../build/client/stats.json")
  const serverRender = require("../build/server/main.js").default

  server.use(PUBLIC_PATH, express.static(CLIENT_OUTPUT))
  server.use(serverRender({ clientStats, CLIENT_OUTPUT }))

  server.listen(PRODUCTION_PORT, () => {})
}
