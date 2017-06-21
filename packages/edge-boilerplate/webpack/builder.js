import path from "path"
import fs from "fs"
import webpack from "webpack"
import webpackPkg from "webpack/package.json"
import ExtractCssChunks from "extract-css-chunks-webpack-plugin"
import StatsPlugin from "stats-webpack-plugin"

const defaults = {
  target: "client",
  env: process.env.NODE_ENV,
  verbose: false
}

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const nodeModules = path.resolve(__dirname, "../node_modules")
const serverExternals = fs
  .readdirSync(nodeModules)
  .filter((x) => !(/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/).test(x))
  .reduce(
    (externals, request) => {
      externals[request] = `commonjs ${request}`
      return externals
    },
    {},
  )

export default function builder(options = {})
{
  const config = { ...defaults, ...options }

  const isServer = config.target === "server"
  const isClient = config.target === "client"

  const isDevelopment = config.env === "development"
  const isProduction = config.env === "production"

  console.log(`Edge Webpack for Webpack@${webpackPkg.version}: Generating Config for: ${config.target}@${config.env}`)

  const name = isServer ? "server" : "client"
  const target = isServer ? "node" : "web"
  const devtool = "source-map"

  const cssLoaderOptions = {
    modules: true,
    localIdentName: "[local]-[hash:base62:8]",
    import: false,
    minimize: false
  }

  const postCSSLoaderRule = {
    loader: "postcss-loader",
    query: {
      sourceMap: true
    }
  }

  const assetFiles = /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html)$/
  const babelFiles = /\.js$/
  const postcssFiles = /\.(css|pcss)$/

  return {
    name,
    target,
    devtool,
    externals: isServer ? serverExternals : undefined,

    entry: [
      isClient && isDevelopment ? "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false" : null,
      isClient ? path.resolve(__dirname, "../src/index.js") : path.resolve(__dirname, "../server/render.js")
    ].filter(Boolean),

    output: {
      libraryTarget: isServer ? "commonjs2" : "var",
      filename: isDevelopment || isServer ? "[name].js" : "[name].[chunkhash].js",
      path: isServer ? path.resolve(__dirname, "../build/server") : path.resolve(__dirname, "../build/client"),
      publicPath: "/static/"
    },

    module: {
      rules: [
        // References to images, fonts, movies, music, etc.
        {
          test: assetFiles,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            emitFile: isClient
          }
        },

        // Transpile our own JavaScript files using the setup in `.babelrc`.
        {
          test: babelFiles,
          exclude: /node_modules/,
          use: [
            "cache-loader",
            "babel-loader"
          ]
        },

        // Use either
        {
          test: postcssFiles,
          use: isClient ? ExtractCssChunks.extract({
            use: [
              "cache-loader",
              {
                loader: "css-loader",
                options: cssLoaderOptions
              },
              postCSSLoaderRule
            ]
          }) : [
            "cache-loader",
            {
              loader: "css-loader/locals",
              options: cssLoaderOptions
            },
            postCSSLoaderRule
          ]
        }
      ]
    },

    plugins: [
      isProduction && isClient ? new StatsPlugin("stats.json") : null,

      // "Use HashedModuleIdsPlugin to generate IDs that preserves over builds."
      // Via: https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273324529
      isProduction ? new webpack.HashedModuleIdsPlugin() : null,

      // I would recommend using NamedModulesPlugin during development (better output).
      // Via: https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273023082
      isDevelopment ? new webpack.NamedModulesPlugin() : null,

      isClient ? new ExtractCssChunks() : null,
      isServer ? new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }) : null,

      // only needed when server built with webpack
      isClient ? new webpack.optimize.CommonsChunkPlugin({
        names: [ "bootstrap" ],

        // needed to put webpack bootstrap code before chunks
        filename: isProduction ? "[name]-[chunkhash].js" : "[name].js",
        minChunks: Infinity
      }) : null,

      isClient && isDevelopment ? new webpack.HotModuleReplacementPlugin() : null,
      isClient && isDevelopment ? new webpack.NoEmitOnErrorsPlugin() : null,

      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(options.env)
        }
      })
    ].filter(Boolean)
  }
}
