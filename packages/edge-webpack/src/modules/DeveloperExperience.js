import webpack from "webpack"
import FriendlyPlugin from "friendly-errors-webpack-plugin"
import ErrorOverlayPlugin from "error-overlay-webpack-plugin"

import { IS_PRODUCTION } from "../config"

const stats = "minimal"
const logLevel = "silent"

// const stats = "normal"
// const logLevel = "info"

export default {
  stats,

  serve: {
    dev: {
      logLevel,
      stats
    },

    hot: {
      logLevel
    }
  },

  plugins: [
    new FriendlyPlugin({
      clearConsole: false
    }),

    new ErrorOverlayPlugin(),

    // Does not work well with HMR and Dev Server
    IS_PRODUCTION ? new webpack.ProgressPlugin() : null
  ].filter(Boolean)
}

