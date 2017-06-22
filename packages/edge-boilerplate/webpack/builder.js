import path from "path"
import fs from "fs"
import webpack from "webpack"
import webpackPkg from "webpack/package.json"
import ExtractCssChunks from "extract-css-chunks-webpack-plugin"
import StatsPlugin from "stats-webpack-plugin"
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin"
import BabiliPlugin from "babili-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import SriPlugin from "webpack-subresource-integrity"
import UglifyPlugin from "uglifyjs-webpack-plugin"

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
  .reduce((externals, request) => {
    externals[request] = `commonjs ${request}`
    return externals
  }, {})

export default function builder(options = {}) {
  const config = { ...defaults, ...options }

  const isServer = config.target === "server"
  const isClient = config.target === "client"

  const isDevelopment = config.env === "development"
  const isProduction = config.env === "production"

  const enableSourceMaps = true
  const writeLegacyOutput = false
  const bundleCompression = true

  console.log(`Edge Webpack for Webpack@${webpackPkg.version}: Generating Config for: ${config.target}@${config.env}`)

  const name = isServer ? "server" : "client"
  const target = isServer ? "node" : "web"
  const devtool = enableSourceMaps ? "source-map" : null

  const cssLoaderOptions = {
    modules: true,
    localIdentName: "[local]-[hash:base62:8]",
    import: false,
    minimize: false,
    sourceMap: enableSourceMaps
  }

  const postCSSLoaderRule = {
    loader: "postcss-loader",
    query: {
      sourceMap: enableSourceMaps
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
      isClient && isDevelopment ?
        "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false" :
        null,
      isClient ? path.resolve(__dirname, "../src/index.js") : path.resolve(__dirname, "../server/render.js")
    ].filter(Boolean),

    output: {
      libraryTarget: isServer ? "commonjs2" : "var",
      filename: isDevelopment || isServer ? "[name].js" : "[name].[chunkhash].js",
      path: isServer ? path.resolve(__dirname, "../build/server") : path.resolve(__dirname, "../build/client"),
      publicPath: "/static/",

      // Enable cross-origin loading without credentials - Useful for loading files from CDN
      crossOriginLoading: "anonymous"
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

        // Compression on all JS files - in a common postprocessing step
        // {
        //   test: babelFiles,
        //   enforce: "post",
        //   use: [
        //     "cache-loader",
        //     {
        //       loader: "babel-loader",
        //       options: {
        //         babelrc: false,
        //         presets: "babili",
        //         plugins: [ "syntax-dynamic-import" ]
        //       }
        //     }
        //   ]
        // },

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
      // Generating static HTML page for simple static deployment
      // https://github.com/jantimon/html-webpack-plugin
      isProduction && isClient ?
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "../src/index.ejs")
        }) :
        null,

      // Subresource Integrity (SRI) is a security feature that enables browsers to verify that
      // files they fetch (for example, from a CDN) are delivered without unexpected manipulation.
      // https://www.npmjs.com/package/webpack-subresource-integrity
      // Browser-Support: http://caniuse.com/#feat=subresource-integrity
      new SriPlugin({
        hashFuncNames: [ "sha256", "sha384" ],
        enabled: isProduction && isClient
      }),

      // Improve OS compatibility
      // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
      new CaseSensitivePathsPlugin(),

      // Let the server side renderer know about our client side assets
      // https://github.com/FormidableLabs/webpack-stats-plugin
      isProduction && isClient ? new StatsPlugin("stats.json") : null,

      // Classic UglifyJS for compressing ES5 compatible code.
      // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
      bundleCompression && writeLegacyOutput && isProduction && isClient ?
        new UglifyPlugin({
          compress: true,
          mangle: true,
          comments: false,
          sourceMap: true
        }) : null,

      // Alternative to Uglify when producing modern output
      // Advanced ES2015 ready JS compression based on Babylon (Babel Parser)
      // https://github.com/webpack-contrib/babili-webpack-plugin
      bundleCompression && !writeLegacyOutput && isProduction && isClient ?
        new BabiliPlugin() : null,

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

      isProduction ? new webpack.optimize.ModuleConcatenationPlugin() : null,

      isClient && isDevelopment ? new webpack.HotModuleReplacementPlugin() : null,
      isDevelopment ? new webpack.NoEmitOnErrorsPlugin() : null,

      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(options.env)
        }
      })
    ].filter(Boolean)
  }
}
