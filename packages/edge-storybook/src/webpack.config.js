import webpack from "webpack"
import { get as getRoot } from "app-root-dir"
import { join } from "path"

/* eslint-disable import/no-commonjs */
module.exports = {
  node: {
    __dirname: true
  },

  plugins: [
    // We use this tricky approach to "send" the root application path to the
    // config so that we can have a literal
    new webpack.DefinePlugin({
      ROOT: JSON.stringify(join(getRoot(), "src"))
    })
  ],

  module: {
    rules: [
      {
        test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|ico|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html|xml)$/,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]"
        }
      },
      {
        test: /\.(css|pcss|sss)$/,
        exclude: [
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
