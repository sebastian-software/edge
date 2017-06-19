const fs = require("fs")
const path = require("path")
const webpack = require("webpack")

const modeModules = path.resolve(__dirname, "../node_modules")
const entry = path.resolve(__dirname, "../server/render.js")
const output = path.resolve(__dirname, "../build/server")

const VERBOSE = false

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const externals = fs
  .readdirSync(modeModules)
  .filter((x) => !(/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/).test(x))
  .reduce(
    (externals, mod) => {
      externals[mod] = `commonjs ${mod}`
      return externals
    },
    {},
  )

module.exports = {
  name: "server",
  target: "node",
  devtool: "source-map",

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

  // devtool: 'eval',
  entry: [ entry ],
  externals,
  output: { path: output, filename: "[name].js", libraryTarget: "commonjs2", publicPath: "/static/" },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: "babel-loader" },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: {
          loader: "css-loader/locals",
          options: { modules: true, localIdentName: "[name]__[local]--[hash:base64:5]" }
        }
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({ "process.env": { NODE_ENV: JSON.stringify("development") } })
  ]
}
