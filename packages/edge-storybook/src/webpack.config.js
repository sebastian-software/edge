import { core } from "edge-webpack"

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

  storybookBaseConfig.module.rules.push(...core.module.rules)
  storybookBaseConfig.plugins.push(...core.plugins)

  return storybookBaseConfig
}
