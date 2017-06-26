import express from "express"
import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import webpackHotServerMiddleware from "webpack-hot-server-middleware"
import configBuilder from "../webpack/builder"
import { CLIENT_OUTPUT, PUBLIC_PATH, DEVELOPMENT_PORT } from "../config"

/* eslint-disable no-console */

const server = express()

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

server.listen(DEVELOPMENT_PORT, () => {
  console.log(`Development Server Started @ Port ${DEVELOPMENT_PORT}`)
})
