import UglifyJsPlugin from "uglifyjs-webpack-plugin"
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin"

import { IS_PRODUCTION, ENABLE_SOURCE_MAPS } from "../config"

export default {
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
  }
}
