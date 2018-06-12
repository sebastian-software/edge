/* eslint-disable import/no-commonjs */

// Import .env files to make it possible to access environment variables inside tests.
require("universal-dotenv")

// Babel transformation but with the possibility to add test-specific plugins/presets.
const babelJest = require("babel-jest")

module.exports = babelJest.createTransformer({
  // any specific babel settings
})
