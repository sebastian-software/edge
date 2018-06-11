// CSS Support
import { loader as extractCssLoader } from "extract-css-chunks-webpack-plugin"

import {
  IS_CLIENT,
  IS_PRODUCTION,
  BABEL_EXTS,
  ASSET_EXTS,
  POSTCSS_EXTS,
  POSTCSS_MODULE_EXTS,
  YAML_EXTS,
  GRAPHQL_EXTS,
  POSTCSS_LOADER_OPTS,
  CSS_LOADER_OPTS,
  CSS_LOADER_MODULE_OPTS
} from "./config"

const ASSET_FILENAME = IS_PRODUCTION ?
  "file-[hash:base62:8].[ext]" :
  "[path][name].[ext]"

export default [
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
      emitFile: IS_CLIENT
    }
  },

  // YAML
  {
    test: YAML_EXTS,
    loaders: [ "cache-loader", "thread-loader", "json-loader", "yaml-loader" ]
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
      "thread-loader",
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
      "thread-loader",
      {
        loader: "css-loader",
        options: CSS_LOADER_OPTS
      },
      {
        loader: "postcss-loader",
        options: POSTCSS_LOADER_OPTS
      }
    ].filter(Boolean)
  },

  {
    test: POSTCSS_MODULE_EXTS,
    use: [
      extractCssLoader,
      "cache-loader",
      "thread-loader",
      {
        loader: "css-loader",
        options: CSS_LOADER_MODULE_OPTS
      },
      {
        loader: "postcss-loader",
        options: POSTCSS_LOADER_OPTS
      }
    ].filter(Boolean)
  }
]
