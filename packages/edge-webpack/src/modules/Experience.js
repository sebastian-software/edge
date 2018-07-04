import webpack from "webpack"
import FriendlyPlugin from "friendly-errors-webpack-plugin"
import ErrorOverlayPlugin from "error-overlay-webpack-plugin"

import { IS_PRODUCTION, IS_DEVELOPMENT } from "../config"

// const stats = "minimal"
// const logLevel = "silent"

const stats = "errors-only"
const logLevel = "info"

export default {
  stats,

  // The new development web server of Webpack
  // See also: https://github.com/webpack-contrib/webpack-serve
  serve: {
    dev: {
      logLevel,
      stats
    },

    hot: {
      logLevel
    }
  },

  // The legacy development web server of Webpack
  // See also: https://webpack.js.org/configuration/dev-server/
  devServer: {
    stats,
    clientLogLevel: logLevel
  },

  plugins: [
    IS_DEVELOPMENT || IS_PRODUCTION ? new FriendlyPlugin({
      clearConsole: false
    }) : null,

    IS_DEVELOPMENT ? new ErrorOverlayPlugin() : null,

    // Does not work well with HMR and Dev Server
    IS_PRODUCTION ? new webpack.ProgressPlugin() : null
  ].filter(Boolean)
}

