/* eslint-disable import/no-commonjs, import/unambiguous */
module.exports = {
  module: {
    rules: [
      {
        test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html|ico)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]"
        }
      },
      {
        test: /\.(css|pcss|sss)$/,
        exclude: [
          /storybook-addon-scissors/,
          /react-select/
        ],
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
        include: [
          /storybook-addon-scissors/,
          /react-select/
        ],
        loaders: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            query: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
}
