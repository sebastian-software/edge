import webpack from "webpack"
import { get as getRoot } from "app-root-dir"
import { resolve } from "path"
import { getEnvironment } from "universal-dotenv"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CssChunksPlugin from "extract-css-chunks-webpack-plugin"
import SriPlugin from "webpack-subresource-integrity"

import rules from "./rules"
import {
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  BUILD_TARGET
} from "./config"

// Modules
import LocalesModule from "./modules/Locales"
import DeveloperExperienceModule from "./modules/DeveloperExperience"
import OptimizationModule from "./modules/Optimization"

export default {
  entry: `./src/${BUILD_TARGET}/index.js`,
  mode: IS_PRODUCTION ? "production" : "development",
  name: BUILD_TARGET,

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

  stats: DeveloperExperienceModule.stats,
  serve: DeveloperExperienceModule.serve,
  optimization: OptimizationModule.optimization,

  plugins: [
    new webpack.DefinePlugin(getEnvironment().webpack),

    ...LocalesModule.plugins,
    ...DeveloperExperienceModule.plugins,

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
      title: process.env.APP_TITLE
    })
  ].filter(Boolean)
}
