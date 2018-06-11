import webpack from "webpack"
import { get as getRoot } from "app-root-dir"
import { resolve } from "path"
import { getEnvironment } from "universal-dotenv"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CssChunksPlugin from "extract-css-chunks-webpack-plugin"
import SriPlugin from "webpack-subresource-integrity"
import FriendlyPlugin from "friendly-errors-webpack-plugin"
import ErrorOverlayPlugin from "error-overlay-webpack-plugin"

import UglifyJsPlugin from "uglifyjs-webpack-plugin"
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin"

import rules from "./rules"
import {
  APP_TITLE,
  MODE,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  ENABLE_SOURCE_MAPS,
  APP_LOCALES
} from "./config"

const LOCALES_MATCHER = new RegExp(`\\b(${APP_LOCALES.join("|")})\\b`)
const LANGUAGES_MATCHER = new RegExp(
  `\\b(${APP_LOCALES.map((entry) => entry.split("-")[0]).join("|")})\\b`
)

const stats = "minimal"
const logLevel = "silent"

// const stats = "normal"
// const logLevel = "info"

export default {
  entry: "./src/client/index.js",
  mode: MODE,
  name: process.env.BUILD_TARGET,

  output: {
    path: resolve(getRoot(), "dist"),
    filename: IS_DEVELOPMENT ? "index.js" : "index.[hash].js",
    chunkFilename: IS_DEVELOPMENT ?
      "chunk-[name].[chunkhash].js" :
      "chunk-[name].[chunkhash].js",
    crossOriginLoading: "anonymous"
  },

  module: {
    rules
  },

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

  optimization: {
    // Docs: https://webpack.js.org/plugins/split-chunks-plugin/
    splitChunks: {
      // There are some issues with HtmlWebpackPlugin and the automatic vendor chunk right now.
      // chunks: "all",
      // Since the chunk name includes all origin chunk names it’s recommended for production builds
      // with long term caching to NOT include [name] in the filenames, or switch off name generation
      // Via: https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      // name: false
    },
    minimizer: IS_PRODUCTION ?
      [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: ENABLE_SOURCE_MAPS
        }),
        new OptimizeCSSAssetsPlugin({})
      ] :
      []
  },

  plugins: [
    new FriendlyPlugin({
      clearConsole: false
    }),

    new ErrorOverlayPlugin(),

    new webpack.DefinePlugin(getEnvironment().webpack),

    // Fix context imports in Webpack to the supported locales
    // This entry is for lean-intl which uses locale specific data packs
    new webpack.ContextReplacementPlugin(
      /lean-intl[/\\]locale-data[/\\]js$/,
      LOCALES_MATCHER
    ),

    // Fix context imports in Webpack to the supported locales
    // This entry is for react-intl which uses language specific data packs
    new webpack.ContextReplacementPlugin(
      /react-intl[/\\]locale-data$/,
      LANGUAGES_MATCHER
    ),

    // Does not work well with HMR and Dev Server
    IS_PRODUCTION ? new webpack.ProgressPlugin() : null,

    new CssChunksPlugin({
      filename: IS_DEVELOPMENT ? "[name].css" : "[name]-[contenthash].css",
      chunkFilename: IS_DEVELOPMENT ?
        "chunk-[name].css" :
        "chunk-[name]-[contenthash].css",
      hot: IS_DEVELOPMENT
    }),

    IS_PRODUCTION ?
      new SriPlugin({
        hashFuncNames: [ "sha256", "sha512" ],
        enabled: IS_PRODUCTION
      }) : null,

    new HtmlWebpackPlugin({
      inject: true,
      title: APP_TITLE
    })
  ].filter(Boolean)
}
