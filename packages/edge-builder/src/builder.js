import fs from "fs"
import webpack from "webpack"
import { get as getRoot } from "app-root-dir"
import { resolve } from "path"
import dotenv from "dotenv"
import chalk from "chalk"

import webpackPkg from "webpack/package.json"

// Using more modern approach of hashing than "webpack-md5-hash". Somehow the SHA256 version
// ("webpack-sha-hash") does not correctly work based (produces different hashes for same content).
// This is basically a replacement of md5 with the loader-utils implementation which also supports
// shorter generated hashes based on base62 encoding instead of hex.
import WebpackDigestHash from "./plugins/ChunkHash"
import ChunkNames from "./plugins/ChunkNames"
import VerboseProgress from "./plugins/VerboseProgress"

// DLL Support
import AutoDllPlugin from "autodll-webpack-plugin"

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

import BundleAnalyzerPlugin from "webpack-bundle-analyzer"
import ZopfliPlugin from "zopfli-webpack-plugin"

import WriteFilePlugin from "write-file-webpack-plugin"

import { getHashDigest } from "loader-utils"

const CACHE_HASH_TYPE = "sha256"
const CACHE_DIGEST_TYPE = "base62"
const CACHE_DIGEST_LENGTH = 4

function removeEmptyKeys(source)
{
  var copy = {}
  for (var key in source)
  {
    if (!(source[key] == null || source[key].length === 0))
      copy[key] = source[key]
  }

  return copy
}

// https://github.com/mishoo/UglifyJS2#compress-options
const UGLIFY_OPTIONS = {
  /* eslint-disable camelcase */

  compress: {
    // Only risky for some rare floating point situations
    unsafe_math: true,

    // optimize expressions like Array.prototype.slice.call(a) into [].slice.call(a)
    unsafe_proto: true,

    // Good for Chrome performance
    keep_infinity: true,

    // Try harder to export less code
    passes: 2
  },

  output: {
    // Fix for problematic code like emoticons
    ascii_only: true,

    // More readable output
    // Whenever possible we will use a newline instead of a semicolon
    semicolons: false,

    // Remove all comments, don't even keep tons of copyright comments
    comments: false
  }
}

const BABILI_OPTIONS = {}

// Initialize environment configuration
dotenv.config()

const CHECK_ENVS = [
  "SERVER_ENTRY",
  "CLIENT_ENTRY",
  "SERVER_VENDOR",
  "CLIENT_VENDOR",
  "SERVER_OUTPUT",
  "CLIENT_OUTPUT",
  "PUBLIC_PATH",
  "HTML_TEMPLATE",
  "DEVELOPMENT_PORT",
  "DEFAULT_LOCALE",
  "SUPPORTED_LOCALES"
]
const envParameters = Object.keys(process.env)
const missingParameters = CHECK_ENVS.filter((key) => !envParameters.includes(key))
if (missingParameters.length > 0)
  throw new Error(
    `Missing environment parameters ${missingParameters.join(", ")}.\n` +
    `Hint: Please provide a proper .env file`
  )

const ROOT = getRoot()
const SERVER_ENTRY = resolve(ROOT, process.env.SERVER_ENTRY)
const CLIENT_ENTRY = resolve(ROOT, process.env.CLIENT_ENTRY)
const SERVER_VENDOR = resolve(ROOT, process.env.SERVER_VENDOR)
const CLIENT_VENDOR = resolve(ROOT, process.env.CLIENT_VENDOR)
const SERVER_OUTPUT = resolve(ROOT, process.env.SERVER_OUTPUT)
const CLIENT_OUTPUT = resolve(ROOT, process.env.CLIENT_OUTPUT)
const PUBLIC_PATH = process.env.PUBLIC_PATH
const HTML_TEMPLATE = resolve(ROOT, process.env.HTML_TEMPLATE)

const defaults = {
  target: "client",
  env: process.env.NODE_ENV,
  verbose: false,
  enableSourceMaps: true,
  bundleCompression: "uglify", // either "uglify", "babili" or null
  useCacheLoader: true,
  babelEnvPrefix: "edge"
}

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const nodeModules = resolve(ROOT, "node_modules")
const serverExternals = fs
  .readdirSync(nodeModules)
  .filter((x) => !(/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/).test(x))
  .reduce((externals, request) => {
    externals[request] = `commonjs ${request}`
    return externals
  }, {})

const assetFiles = /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html|ico)$/
const babelFiles = /\.(js|mjs|jsx)$/
const postcssFiles = /\.(css|sss|pcss)$/
const compressableAssets = /\.(ttf|otf|svg|pdf|html|ico|txt|md|html|js|css|json|xml)$/

export default function builder(options = {}) {
  const config = { ...defaults, ...options }

  // process.env.NODE_ENV is typically set but still could be undefined. Fix that.
  if (config.env == null) {
    config.env = "development"
  }

  const isServer = config.target === "server"
  const isClient = config.target === "client"

  const isDevelopment = config.env === "development"
  const isProduction = config.env === "production"

  const BABEL_ENV = `${config.babelEnvPrefix}-${config.env}-${config.target}`

  const PROJECT_CONFIG = require(resolve(ROOT, "package.json"))
  const CACHE_HASH = getHashDigest(JSON.stringify(PROJECT_CONFIG), CACHE_HASH_TYPE, CACHE_DIGEST_TYPE, CACHE_DIGEST_LENGTH)
  const PREFIX = chalk.bold(config.target.toUpperCase())

  const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE
  const SUPPORTED_LOCALES = process.env.SUPPORTED_LOCALES.split(",")

  const USE_AUTODLL = false

  const name = isServer ? "server" : "client"
  const target = isServer ? "node" : "web"
  const devtool = config.enableSourceMaps ? "source-map" : null

  console.log(chalk.underline(`${PREFIX} Configuration:`))
  console.log(`→ Environment: ${config.env}`)
  console.log(`→ Build Target: ${target}`)
  console.log(`→ Babel Environment: ${BABEL_ENV}`)
  console.log(`→ Enable Source Maps: ${devtool}`)
  console.log(`→ Bundle Compression: ${config.bundleCompression}`)
  console.log(`→ Use Cache Loader: ${config.useCacheLoader} [Hash: ${CACHE_HASH}]`)
  console.log(`→ Default Locale: ${DEFAULT_LOCALE}`)
  console.log(`→ Supported Locales: ${SUPPORTED_LOCALES}`)

  const cacheLoader = config.useCacheLoader ? {
    loader: "cache-loader",
    options: {
      cacheDirectory: resolve(ROOT, `.cache/loader-${CACHE_HASH}-${config.target}-${config.env}`)
    }
  } : null

  const cssLoaderOptions = {
    modules: true,
    localIdentName: "[local]-[hash:base62:8]",
    import: false,

    // We are using CSS-O as part of our PostCSS-Chain
    minimize: false,
    sourceMap: config.enableSourceMaps
  }

  const postCSSLoaderRule = {
    loader: "postcss-loader",
    query: {
      sourceMap: config.enableSourceMaps
    }
  }

  return {
    name,
    target,
    devtool,
    context: ROOT,
    externals: isServer ? serverExternals : undefined,

    entry: removeEmptyKeys({
      vendor: !USE_AUTODLL ? (isServer ? SERVER_VENDOR : CLIENT_VENDOR) : null,
      main: [
        isClient && isDevelopment ?
          "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=false&noInfo=false" :
          null,
        isServer ? SERVER_ENTRY : CLIENT_ENTRY
      ].filter(Boolean)
    }),

    output: {
      libraryTarget: isServer ? "commonjs2" : "var",
      filename: isDevelopment || isServer ? "[name].js" : "[name]-[chunkhash].js",
      chunkFilename: isDevelopment || isServer ? "[name].js" : "[name]-[chunkhash].js",
      path: isServer ? SERVER_OUTPUT : CLIENT_OUTPUT,
      publicPath: PUBLIC_PATH,

      // Enable cross-origin loading without credentials - Useful for loading files from CDN
      crossOriginLoading: "anonymous"
    },

    module: {
      rules: [
        {
          test: babelFiles,
          use: [ "source-map-loader" ],
          enforce: "pre",
          exclude: [
            // These packages point to sources which do not exist
            // See also: https://github.com/webpack-contrib/source-map-loader/issues/18
            /intl-/,
            /apollo-/
          ]
        },

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
          use:
          [
            cacheLoader,
            {
              loader: "babel-loader",
              options: {
                babelrc: true,
                forceEnv: BABEL_ENV,
                plugins: [
                  "dual-import"
                ]
              }
            }
          ].filter(Boolean)
        },

        // Use either
        {
          test: postcssFiles,
          use: isClient ? ExtractCssChunks.extract({
            use:
            [
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
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(options.env),
          TARGET: JSON.stringify(target),
          DEFAULT_LOCALE: JSON.stringify(DEFAULT_LOCALE),
          SUPPORTED_LOCALES: JSON.stringify(SUPPORTED_LOCALES)
        }
      }),

      // Generating static HTML page for simple static deployment
      // https://github.com/jantimon/html-webpack-plugin
      isProduction && isClient ?
        new HtmlWebpackPlugin({
          template: HTML_TEMPLATE
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
      new VerboseProgress({
        prefix: PREFIX
      }),

      // Automatically assign quite useful and matching chunk names based on file names.
      // new ChunkNames({
      //   debug: false
      // }),

      // Automatically generate a re-used DLL file for faster compilation times.
      // https://github.com/asfktz/autodll-webpack-plugin
      // Waiting for https://github.com/faceyspacey/webpack-flush-chunks/issues/18
      // https://github.com/asfktz/autodll-webpack-plugin/issues/23
      USE_AUTODLL ? new AutoDllPlugin({
        filename: "[name]-[chunkhash].js",
        context: ROOT,
        debug: true,
        inject: isProduction && isClient,
        entry: {
          vendor: [
            isServer ? SERVER_VENDOR : CLIENT_VENDOR
          ]
        }
      }) : null,

      // Analyse bundle in production
      isClient && isProduction ? new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
        analyzerMode: "static",
        defaultSizes: "gzip",
        logLevel: "silent",
        openAnalyzer: false,
        reportFilename: "report.html"
      }) : null,

      // Analyse bundle in production
      isServer && isProduction ? new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
        analyzerMode: "static",
        defaultSizes: "parsed",
        logLevel: "silent",
        openAnalyzer: false,
        reportFilename: "report.html"
      }) : null,

      // Forces webpack-dev-server program to write bundle files to the file system.
      // https://github.com/gajus/write-file-webpack-plugin
      isClient && isDevelopment ? new WriteFilePlugin({
        log: true
      }) : null,

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
      config.bundleCompression === "uglify" && isProduction && isClient ?
        new UglifyPlugin({
          sourceMap: config.enableSourceMaps,
          comments: false,
          uglifyOptions: UGLIFY_OPTIONS
        }) : null,

      // Alternative to Uglify when producing modern output
      // Advanced ES2015 ready JS compression based on Babylon (Babel Parser)
      // https://github.com/webpack-contrib/babili-webpack-plugin
      config.bundleCompression === "babili" && isProduction && isClient ?
        new BabiliPlugin(BABILI_OPTIONS, { comments: false }) : null,

      // "Use HashedModuleIdsPlugin to generate IDs that preserves over builds."
      // Via: https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273324529
      isProduction ? new webpack.HashedModuleIdsPlugin() : null,

      // I would recommend using NamedModulesPlugin during development (better output).
      // Via: https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273023082
      isDevelopment ? new webpack.NamedModulesPlugin() : null,

      isClient ? new ExtractCssChunks({
        filename: isDevelopment ? "[name].css" : "[name]-[contenthash:base62:8].css"
      }) : null,

      isServer ? new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }) : null,

      // Extract Webpack bootstrap code with knowledge about chunks into separate cachable package.
      // isClient ? new webpack.optimize.CommonsChunkPlugin({
      //   names: [ "bootstrap" ],

      //   // needed to put webpack bootstrap code before chunks
      //   filename: isProduction ? "[name]-[chunkhash].js" : "[name].js",
      //   minChunks: Infinity
      // }) : null,

      // https://webpack.js.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk
      !USE_AUTODLL && isClient ? new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",

        // With more entries, this ensures that no other module goes into the vendor chunk
        minChunks: Infinity
      }) : null,

      isProduction ? new webpack.optimize.ModuleConcatenationPlugin() : null,

      isClient && isDevelopment ? new webpack.HotModuleReplacementPlugin() : null,
      isDevelopment ? new webpack.NoEmitOnErrorsPlugin() : null,

      // Compress static files with zopfli (gzip) compression
      // https://github.com/webpack-contrib/zopfli-webpack-plugin
      // isProduction && isClient ? new ZopfliPlugin({
      //   test: compressableAssets,
      //   verbose: true
      // }) : null
    ].filter(Boolean)
  }
}
