module.exports = {
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.(mjs|js|jsx)$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            babelrc: false,
            presets: [
              [ "edge", { target: "modern" }]
            ]
          }
        },
        {
          test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html)$/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]"
          }
        },
        {
          test: /\.(css|sss|pcss)$/,
          loaders: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader",
              query:
              {
                sourceMap: true,
                modules: true,
                localIdentName: "[path][name]-[local]",
                minimize: false,
                import: false
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
    }
  }
}
