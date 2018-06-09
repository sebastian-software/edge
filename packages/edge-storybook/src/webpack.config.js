import webpack from "webpack"
import { getEnvironment } from "universal-dotenv"

const rules = [
  // Transpile our own JavaScript files using the setup in `.babelrc`.
  {
    test: /\.(js|mjs|jsx)$/,
    exclude: /node_modules/,
    use:
    [
      {
        loader: "babel-loader",
        options: {
          babelrc: true
        }
      }
    ]
  },
  {
    test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|ico|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html|xml)$/,
    loader: "file-loader",
    options: {
      name: "[path][name].[ext]"
    }
  },
  {
    test: /\.module\.(css|sss|pcss)$/,
    loaders: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: true,
          modules: true,
          localIdentName: "[path][name]-[local]",
          minimize: false,
          import: false
        }
      },
      {
        loader: "postcss-loader",
        options: {
          sourceMap: true
        }
      }
    ]
  },
  {
    test: /\.css$/,
    exclude: /\.module\.(css|sss|pcss)$/,
    loaders: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader",
        query: {
          sourceMap: true,
          minimize: false,
          import: false
        }
      }
    ]
  }
]

const plugins = [
  // The context require feature of Webpack - which we use to load our stories
  // from the application folders, require a static primitive value (no variable)
  // A nice trick here is to inject this variable via the DefinePlugin before
  // it runs in the application and is therefor processed before `require.context`.
  new webpack.DefinePlugin(getEnvironment().webpack)
]

/* eslint-disable import/no-commonjs */
// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Replace Storybooks Babel Loader with local one.
  // This enables Babel v7 support.
  for (const rule of storybookBaseConfig.module.rules) {
    if (/babel/.exec(rule.loader)) {
      rule.loader = require.resolve("babel-loader")
    }
  }

  storybookBaseConfig.module.rules.push(...rules)
  storybookBaseConfig.plugins.push(...plugins)

  return storybookBaseConfig
}
