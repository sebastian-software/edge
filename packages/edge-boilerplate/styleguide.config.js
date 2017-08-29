/* eslint-disable import/no-commonjs, import/unambiguous */
module.exports = {
  title: "Edge Boilerplate",
  styleguideDir: "docs/styleguide",
  serverPort: 1559,
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          exclude: /node_modules/,
          use:
          [
            {
              loader: "babel-loader",
              options: {
                babelrc: true,
                forceEnv: "edge-development-client"
              }
            }
          ]
        },
        {
          test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html|ico)$/,
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]"
          }
        },
        {
          test: /\.(css|pcss|sss)$/,
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
        }
      ]
    }
  }
}
