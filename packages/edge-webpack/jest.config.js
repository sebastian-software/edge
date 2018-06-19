/* eslint-disable import/no-commonjs */
module.exports = {
  preset: "jest-preset-edge",
  verbose: true,
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/__tests__/.*/src"
  ]
}
