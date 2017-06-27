import path from "path"
import fs from "fs"
import webpack from "webpack"
import webpackPkg from "webpack/package.json"

// Using more modern approach of hashing than "webpack-md5-hash". Somehow the SHA256 version
// ("webpack-sha-hash") does not correctly work based (produces different hashes for same content).
// This is basically a replacement of md5 with the loader-utils implementation which also supports
// shorter generated hashes based on base62 encoding instead of hex.
import WebpackDigestHash from "./plugins/ChunkHash"
import ChunkNames from "./plugins/ChunkNames"
import VerboseProgress from "./plugins/VerboseProgress"

// CSS Support
import ExtractCssChunks from "extract-css-chunks-webpack-plugin"

// Core
import StatsPlugin from "stats-webpack-plugin"
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin"

// Generating static HTML pages
import HtmlWebpackPlugin from "html-webpack-plugin"
import SriPlugin from "webpack-subresource-integrity"

// Compression
import BabiliPlugin from "babili-webpack-plugin"
import UglifyPlugin from "uglifyjs-webpack-plugin"

import dotenv from "dotenv"

// Initialize environment configuration
dotenv.config()

const SERVER_ENTRY = process.env.SERVER_ENTRY
const CLIENT_ENTRY = process.env.CLIENT_ENTRY
const SERVER_OUTPUT = process.env.SERVER_OUTPUT
const CLIENT_OUTPUT = process.env.CLIENT_OUTPUT
const PUBLIC_PATH = process.env.PUBLIC_PATH
const ROOT = process.env.ROOT

const defaults = {
  target: "client",
  env: process.env.NODE_ENV,
  verbose: false,
  enableSourceMaps: true,
  writeLegacyOutput: false,
  bundleCompression: true,
  useCacheLoader: true
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

  console.log(`Edge Webpack for Webpack@${webpackPkg.version}: Generating Config for: ${config.target}@${config.env}`)
  console.log(`- Source Maps: ${config.enableSourceMaps}`)
  console.log(`- Legacy ES5 Output: ${config.writeLegacyOutput}`)
  console.log(`- Bundle Compression: ${config.bundleCompression}`)
  console.log(`- Use Cache Loader: ${config.useCacheLoader}`)

  const name = isServer ? "server" : "client"
  const target = isServer ? "node" : "web"
  const devtool = config.enableSourceMaps ? "source-map" : null

  const cacheLoader = config.useCacheLoader ? {
    loader: "cache-loader",
    options: {
      cacheDirectory: path.resolve(ROOT, `.cache/${config.target}-${config.env}`)
    }
  } : null

  const cssLoaderOptions = {
    modules: true,
    localIdentName: "[local]-[hash:base62:8]",
    import: false,
    minimize: false,
    sourceMap: config.enableSourceMaps
  }

  const postCSSLoaderRule = {
    loader: "postcss-loader",
    query: {
      sourceMap: config.enableSourceMaps
    }
  }

  const developmentBabelOptions = {
  }

  const productionBabelOptions = {
    presets: [ "babili" ]
  }

  const assetFiles = /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html)$/
  const babelFiles = /\.(js|mjs|jsx)$/
  const postcssFiles = /\.(css|sss|pcss)$/

  return {
    name,
    target,
    devtool,
    externals: isServer ? serverExternals : undefined,

    entry: [
      isClient && isDevelopment ?
        "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false" :
        null,
      isServer ? SERVER_ENTRY : CLIENT_ENTRY
    ].filter(Boolean),

    output: {
      libraryTarget: isServer ? "commonjs2" : "var",
      filename: isDevelopment || isServer ? "[name].js" : "[name].[chunkhash].js",
      chunkFilename: isDevelopment || isServer ? "[name].js" : "[name]-[chunkhash].js",
      path: isServer ? SERVER_OUTPUT : CLIENT_OUTPUT,
      publicPath: PUBLIC_PATH,

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
            name: isProduction ? "file-[hash:base62:8].[ext]" : "[name].[ext]",
            emitFile: isClient
          }
        },

        // JSON
        {
          test: /\.json$/,
          loader: "json-loader",
          exclude: [
            /locale-data/
          ]
        },

        // YAML
        {
          test: /\.(yml|yaml)$/,
          loaders: [ "json-loader", "yaml-loader" ]
        },

        // GraphQL support
        // @see http://dev.apollodata.com/react/webpack.html
        {
          test: /\.(graphql|gql)$/,
          loader: "graphql-tag/loader"
        },

        // Transpile our own JavaScript files using the setup in `.babelrc`.
        {
          test: babelFiles,
          exclude: /node_modules/,
          use: [
            cacheLoader,
            {
              loader: "babel-loader",
              options: {
                ...(isProduction ? productionBabelOptions : developmentBabelOptions),
                babelrc: true
              }
            }
          ].filter(Boolean)
        },

        // Compress other JS files using a loader which is based on babilii as well.
        // Notice the different include/exclude sections.
        // This config is also ignoring the project specific .babelrc as code inside
        // node_modules should be transpiled already.
        config.bundleCompression ? null : {
          test: babelFiles,
          include: /(node_modules)/,
          use: [
            cacheLoader,
            {
              loader: "babel-loader",
              options: {
                ...(isProduction ? productionBabelOptions : developmentBabelOptions),
                babelrc: false
              }
            }
          ].filter(Boolean)
        },

        // Use either
        {
          test: postcssFiles,
          use: isClient ? ExtractCssChunks.extract({
            use: [
              cacheLoader,
              {
                loader: "css-loader",
                options: cssLoaderOptions
              },
              postCSSLoaderRule
            ].filter(Boolean)
          }) : [
            cacheLoader,
            {
              loader: "css-loader/locals",
              options: cssLoaderOptions
            },
            postCSSLoaderRule
          ].filter(Boolean)
        }
      ].filter(Boolean)
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
        hashFuncNames: [ "sha256", "sha512" ],
        enabled: isProduction && isClient
      }),

      // Improve OS compatibility
      // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
      new CaseSensitivePathsPlugin(),

      // Custom progress plugin
      new VerboseProgress(),

      // Automatically assign quite useful and matching chunk names based on file names.
      new ChunkNames(),

      // We use this so that our generated [chunkhash]'s are only different if
      // the content for our respective chunks have changed.  This optimises
      // our long term browser caching strategy for our client bundle, avoiding
      // cases where browsers end up having to download all the client chunks
      // even though 1 or 2 may have only changed.
      isProduction && isClient ? new WebpackDigestHash() : null,

      // Let the server side renderer know about our client side assets
      // https://github.com/FormidableLabs/webpack-stats-plugin
      isProduction && isClient ? new StatsPlugin("stats.json") : null,

      // Classic UglifyJS for compressing ES5 compatible code.
      // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
      config.bundleCompression && config.writeLegacyOutput && isProduction && isClient ?
        new UglifyPlugin({
          compress: true,
          mangle: true,
          comments: false,
          sourceMap: true
        }) : null,

      // Alternative to Uglify when producing modern output
      // Advanced ES2015 ready JS compression based on Babylon (Babel Parser)
      // https://github.com/webpack-contrib/babili-webpack-plugin
      config.bundleCompression && !config.writeLegacyOutput && isProduction && isClient ?
        new BabiliPlugin() : null,

      // "Use HashedModuleIdsPlugin to generate IDs that preserves over builds."
      // Via: https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273324529
      // isProduction ? new webpack.HashedModuleIdsPlugin() : null,

      // I would recommend using NamedModulesPlugin during development (better output).
      // Via: https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273023082
      // isDevelopment ? new webpack.NamedModulesPlugin() : null,

      isClient ? new ExtractCssChunks({
        filename: isDevelopment ? "[name].css" : "[name].[contenthash:base62:8].css"
      }) : null,
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
