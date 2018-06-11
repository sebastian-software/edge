import { resolve } from "path"

// Basic Configuration Adapter
import { IS_DEVELOPMENT, BUILD_TARGET } from "./config"

// Individual Feature Modules
import EnvironmentModule from "./modules/Environment"
import LocalesModule from "./modules/Locales"
import ExperienceModule from "./modules/Experience"
import OptimizationModule from "./modules/Optimization"
import RulesModule from "./modules/Rules"
import StaticModule from "./modules/Static"

export default {
  name: EnvironmentModule.name,
  mode: EnvironmentModule.mode,
  entry: {
    main: [ resolve(process.env.APP_ROOT, `src/${BUILD_TARGET}/index.js`) ]
  },

  output: {
    path: resolve(process.env.APP_ROOT, "dist"),
    filename: IS_DEVELOPMENT ? "index.js" : "index.[hash].js",
    chunkFilename: IS_DEVELOPMENT ?
      "chunk-[name].[chunkhash].js" :
      "chunk-[name].[chunkhash].js",
    crossOriginLoading: "anonymous"
  },

  module: {
    rules: RulesModule.rules
  },

  stats: ExperienceModule.stats,
  serve: ExperienceModule.serve,
  optimization: OptimizationModule.optimization,

  plugins: [
    ...EnvironmentModule.plugins,
    ...LocalesModule.plugins,
    ...ExperienceModule.plugins,
    ...RulesModule.plugins,
    ...StaticModule.plugins
  ].filter(Boolean)
}
