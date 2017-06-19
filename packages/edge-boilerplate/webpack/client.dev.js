const path = require("path")
const webpack = require("webpack")
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")

const VERBOSE = false

module.exports = {
  name: "client",
  target: "web",
  devtool: "source-map",

  entry: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false",
    path.resolve(__dirname, "../src/index.js")
  ],

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../build/client"),
    publicPath: "/static/"
  },

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: VERBOSE,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },
  performance: false,

  module:
  {
    rules: [
      // References to images, fonts, movies, music, etc.
      {
        test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          emitFile: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ExtractCssChunks.extract({
          use: [
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: "[local]-[hash:base62:8]",
                import: false,
                minimize: false
              }
            },
            {
              loader: "postcss-loader",
              query:
              {
                sourceMap: true
              }
            }
          ]
        })
      }
    ]
  },


  plugins: [
    new webpack.ProgressPlugin(),
    new ExtractCssChunks(),
    new webpack.NamedModulesPlugin(),

    // only needed when server built with webpack
    new webpack.optimize.CommonsChunkPlugin({
      names: [ "bootstrap" ],

      // needed to put webpack bootstrap code before chunks
      filename: "[name].js",
      minChunks: Infinity
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    })
  ]
}
