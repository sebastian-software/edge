import express from "express"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware-multi-compiler"
import webpackHotMiddleware from "webpack-hot-middleware"
import webpackHotServerMiddleware from "webpack-hot-server-middleware"

import configBuilder from "../webpack/builder"
const clientConfig = configBuilder({
  target: "client",
  env: process.env.NODE_ENV
})
const serverConfig = configBuilder({
  target: "server",
  env: process.env.NODE_ENV
})

const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path



const server = express()

const PORT = 3000

if (process.env.NODE_ENV === "development") {
  const multiCompiler = webpack([ clientConfig, serverConfig ])
  const clientCompiler = multiCompiler.compilers[0]

  server.use(webpackDevMiddleware(multiCompiler, {
    // required
    publicPath,

    // display no info to console (only warnings and errors)
    noInfo: true
  }))

  server.use(webpackHotMiddleware(clientCompiler))

  // keeps serverRender updated with arg: { clientStats, outputPath }
  server.use(webpackHotServerMiddleware(multiCompiler, {
    serverRendererOptions: { outputPath }
  }))
}
else
{
  const clientStats = require("../build/client/stats.json")
  const serverRender = require("../build/server/main.js").default

  server.use(publicPath, express.static(outputPath))
  server.use(serverRender({ clientStats, outputPath }))
}

server.listen(PORT, () => {})
