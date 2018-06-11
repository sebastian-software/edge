import HtmlWebpackPlugin from "html-webpack-plugin"
import SriPlugin from "webpack-subresource-integrity"

import { IS_PRODUCTION } from "../config"

export default {
  plugins: [
    IS_PRODUCTION ?
      new SriPlugin({
        hashFuncNames: [ "sha256", "sha512" ],
        enabled: IS_PRODUCTION
      }) :
      null,

    new HtmlWebpackPlugin({
      inject: true,
      title: process.env.APP_TITLE || null
    })
  ].filter(Boolean)
}
