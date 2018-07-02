import { core } from "edge-webpack"

/* eslint-disable import/no-commonjs */
// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Replace Storybooks Babel Loader with local one.
  // This enables Babel v7 support.
  storybookBaseConfig.module.rules.forEach((rule) => {
    if (/babel/.exec(rule.loader)) {
      rule.loader = require.resolve("babel-loader")
    }
  })

  const options = {}
  const config = core(options)

  storybookBaseConfig.module.rules.push(...config.module.rules)
  storybookBaseConfig.plugins.push(...config.plugins)

  return storybookBaseConfig
}
