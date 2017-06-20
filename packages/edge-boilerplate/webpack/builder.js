const path = require("path")
const webpack = require("webpack")
const fs = require("fs")
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")


export default function builder(options = {})
{
  const isServer = options.target === "server"
  const isClient = options.target === "client"

  const name = isServer ? "server" : "client"
  const target = isServer ? "node" : "web"
  const devtool = "source-map"

  const nodeModules = path.resolve(__dirname, "../node_modules")

  // if you're specifying externals to leave unbundled, you need to tell Webpack
  // to still bundle `react-universal-component`, `webpack-flush-chunks` and
  // `require-universal-module` so that they know they are running
  // within Webpack and can properly make connections to client modules:
  const externals = fs
    .readdirSync(nodeModules)
    .filter((x) => !(/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/).test(x))
    .reduce(
      (externals, request) => {
        externals[request] = `commonjs ${request}`
        return externals
      },
      {},
    )



  return {
    name,
    target,
    devtool,
    externals: isServer ? externals : undefined,

    entry: [
      isClient ? "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false" : null,
      isClient ? path.resolve(__dirname, "../src/index.js") : path.resolve(__dirname, "../server/render.js")
    ].filter((entry) => entry != null),

    output: {
      libraryTarget: isServer ? "commonjs2" : "var",
      filename: "[name].js",
      path: isServer ? path.resolve(__dirname, "../build/server") : path.resolve(__dirname, "../build/client"),
      publicPath: "/static/"
    },

    module: {
      rules: [
        // References to images, fonts, movies, music, etc.
        {
          test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            emitFile: isClient
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: "babel-loader"
        },

        {
          test: /\.css$/,
          use: isClient ? ExtractCssChunks.extract({
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
          }) : [
            {
              loader: "css-loader/locals",
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
        }
      ]
    },

    plugins: [
      // new webpack.ProgressPlugin(),
      isClient ? new ExtractCssChunks() : null,
      new webpack.NamedModulesPlugin(),
      isServer ? new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }) : null,

      // only needed when server built with webpack
      isClient ? new webpack.optimize.CommonsChunkPlugin({
        names: [ "bootstrap" ],

        // needed to put webpack bootstrap code before chunks
        filename: "[name].js",
        minChunks: Infinity
      }) : null,

      isClient ? new webpack.HotModuleReplacementPlugin() : null,
      isClient ? new webpack.NoEmitOnErrorsPlugin() : null,

      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("development")
        }
      })
    ].filter((entry) => entry != null)
  }
}
