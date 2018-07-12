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

import { Hasher } from "asset-hash"

// We can't set `hashDigest: base52` currently because of limitations in Webpacks validation rules.
class ModifiedHasher extends Hasher {
  digest() {
    return super.digest("base52")
  }
}

const node = BUILD_TARGET === "client" ? {
  fs: "empty",
  __filename: "mock",
  __dirname: "mock"
} : null

// For usage in otherwise pre-defined Webpack environment like Storybook
export const core = (options = {}) => ({
  module: {
    rules: RulesModule.rules
  },

  node,

  stats: ExperienceModule.stats,
  serve: ExperienceModule.serve,
  devServer: ExperienceModule.devServer,

  plugins: [
    ...EnvironmentModule.plugins,
    ...LocalesModule.plugins,
    ...RulesModule.plugins
  ].filter(Boolean)
})

export const full = (options = {}) => ({
  name: EnvironmentModule.name,
  mode: EnvironmentModule.mode,
  entry: {
    main: [ resolve(options.root || process.env.APP_ROOT, `src/${BUILD_TARGET}/index.js`) ]
  },

  node,

  output: {
    path: resolve(options.root || process.env.APP_ROOT, "dist"),
    filename: IS_DEVELOPMENT ? "index.js" : "index.[hash].js",
    chunkFilename: IS_DEVELOPMENT ?
      "chunk-[name].[chunkhash].js" :
      "chunk-[name].[chunkhash].js",
    crossOriginLoading: "anonymous",
    hashFunction: ModifiedHasher

    // Unfortunately we are unable to use other digests right now as the validation of Webpack prevents this.
    // This is also the reason why we use a slightly modified Hasher with built-in enforcement to `base52`.
    // hashDigest: "base52"
  },

  module: {
    rules: RulesModule.rules,
    noParse: [
      // Fix broken CommonJS library export in MapBox
      // See also: https://github.com/mapbox/mapbox-gl-js/issues/4359#issuecomment-288001933
      /(mapbox-gl)\.js$/
    ]
  },

  stats: ExperienceModule.stats,
  serve: ExperienceModule.serve,
  devServer: ExperienceModule.devServer,

  optimization: OptimizationModule.optimization,

  plugins: [
    ...EnvironmentModule.plugins,
    ...LocalesModule.plugins,
    ...ExperienceModule.plugins,
    ...RulesModule.plugins,
    ...StaticModule.plugins
  ].filter(Boolean)
})
