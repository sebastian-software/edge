// CSS Support
import CssChunksPlugin, { loader as extractCssLoader } from "extract-css-chunks-webpack-plugin"

import {
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  BUILD_TARGET,
  ENABLE_SOURCE_MAPS,
  BABEL_EXTS,
  ASSET_EXTS,
  POSTCSS_EXTS,
  POSTCSS_MODULE_EXTS,
  YAML_EXTS,
  GRAPHQL_EXTS
} from "../config"

const CSS_LOADER_OPTS = {
  import: false,

  // We are using CSS-O as part of our PostCSS-Chain
  minimize: false,
  sourceMap: ENABLE_SOURCE_MAPS
}

const CSS_LOADER_MODULE_OPTS = {
  ...CSS_LOADER_OPTS,
  modules: true,
  localIdentName: "[local]-[hash:base62:8]"
}

const THREAD_LOADER = {
  loader: require.resolve("thread-loader"),
  options: {
    // Via: https://webpack.js.org/guides/build-performance/#sass
    // node-sass has a bug which blocks threads from the Node.js thread pool.
    // When using it with the thread-loader set workerParallelJobs: 2.
    workerParallelJobs: 2,
    poolTimeout: process.env.NODE_ENV === "development" ? Infinity : 500 // keep workers alive for more effective watch mode
  }
}

const ASSET_FILENAME = IS_PRODUCTION ?
  "file-[hash:base62:8].[ext]" :
  "[path][name].[ext]"

export default {
  plugins: [
    new CssChunksPlugin({
      filename: IS_DEVELOPMENT ? "[name].css" : "[name]-[contenthash].css",
      chunkFilename: IS_DEVELOPMENT ?
        "chunk-[name].css" :
        "chunk-[name]-[contenthash].css",
      hot: IS_DEVELOPMENT
    })
  ],

  rules: [
    // This loader is especially useful when using 3rd-party libraries having their own source maps.
    // Which is probably the case most of the time as there is a trend of bundling to ESM e.g. via Rollup.
    {
      test: BABEL_EXTS,
      loader: "source-map-loader",
      enforce: "pre",
      // We have to exclude some Typescript project which do not deliver source maps correctly bundled
      // with the NPM published library. In these cases, without exclude rules, the loader crashes.
      exclude: [ /apollo|graphql/ ],
      options: {
        quiet: true
      }
    },

    // Special support for application manifest files
    {
      test: /manifest.json|\.webmanifest$/,
      type: "javascript/auto",
      use: [
        {
          loader: "file-loader",
          options: {
            name: ASSET_FILENAME
          }
        },
        {
          loader: "app-manifest-loader"
        }
      ]
    },

    // References to images, fonts, movies, music, etc.
    {
      test: ASSET_EXTS,
      exclude: [ /manifest.json$/ ],
      loader: "file-loader",
      options: {
        name: ASSET_FILENAME,
        emitFile: BUILD_TARGET === "client"
      }
    },

    // YAML
    {
      test: YAML_EXTS,
      loaders: [ "cache-loader", THREAD_LOADER, "json-loader", "yaml-loader" ]
    },

    // GraphQL support
    // @see http://dev.apollodata.com/react/webpack.html
    {
      test: GRAPHQL_EXTS,
      loader: "graphql-tag/loader"
    },

    // Transpile our own JavaScript files using the setup in `.babelrc`.
    {
      test: BABEL_EXTS,
      exclude: /node_modules/,
      use: [
        // Note:
        // We prefer cache-loader over babel cache mechanism. Reason:
        // "They both serve the same purpose and are interchangeable, with cache-loader being the 'newer and official' way to cache a loader in general"
        "cache-loader",
        THREAD_LOADER,
        {
          loader: "babel-loader",
          options: {
            babelrc: true
          }
        }
      ]
    },

    {
      test: POSTCSS_EXTS,
      exclude: POSTCSS_MODULE_EXTS,
      use: [
        extractCssLoader,
        "cache-loader",
        THREAD_LOADER,
        {
          loader: "css-loader",
          options: CSS_LOADER_OPTS
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: ENABLE_SOURCE_MAPS
          }
        }
      ].filter(Boolean)
    },

    {
      test: POSTCSS_MODULE_EXTS,
      use: [
        extractCssLoader,
        "cache-loader",
        THREAD_LOADER,
        {
          loader: "css-loader",
          options: CSS_LOADER_MODULE_OPTS
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: ENABLE_SOURCE_MAPS
          }
        }
      ].filter(Boolean)
    }
  ]
}
