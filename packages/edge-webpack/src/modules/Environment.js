import { getEnvironment } from "universal-dotenv"
import webpack from "webpack"

import { IS_PRODUCTION, BUILD_TARGET } from "../config"

export default {
  mode: IS_PRODUCTION ? "production" : "development",
  name: BUILD_TARGET,

  plugins: [
    new webpack.DefinePlugin(getEnvironment().webpack)
  ]
}
