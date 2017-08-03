import webpack from "webpack"
import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"
import webpackHotServerMiddleware from "webpack-hot-server-middleware"
import configBuilder from "../builder"

export function addDevMiddleware(server, config) {
  const clientConfig = configBuilder({
    ...config,
    target: "client",
    env: "development"
  })

  const serverConfig = configBuilder({
    ...config,
    target: "server",
    env: "development"
  })

  const multiCompiler = webpack([ clientConfig, serverConfig ])
  const clientCompiler = multiCompiler.compilers[0]

  server.use(webpackDevMiddleware(multiCompiler, {
    // required
    publicPath: config.output.public,

    // we have our custom error handling for webpack which offers far better DX
    quiet: true,

    // display no info to console (only warnings and errors)
    noInfo: true
  }))

  server.use(webpackHotMiddleware(clientCompiler))

  // keeps serverRender updated with arg: { clientStats, outputPath }
  server.use(webpackHotServerMiddleware(multiCompiler, {
    serverRendererOptions: {
      outputPath: config.output.client
    }
  }))

  return multiCompiler
}
