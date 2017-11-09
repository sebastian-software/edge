/* eslint-disable */
module.exports = {
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|ico|svg|eot|otf|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|html|xml)$":
      require.resolve("./jest.file.js"),
    "\\.css$": "identity-obj-proxy"
  },

  setupFiles: [
    "raf/polyfill",
    require.resolve("./jest.setup.js")
  ],

  collectCoverageFrom: [
    "src/**.js"
  ],

  coveragePathIgnorePatterns: [
    // NPM packages
    "/node_modules/",

    // Publish Export Entries
    "src/index\.js",
    "src/client\.js",
    "src/server\.js",
    "src/binary\.js",
    "src/dev\.js",

    // Webpack Entry Points
    "/client/",
    "/server/",

    // Application Glue Code
    "src/Application\.js",
    "src/State\.js",
    "/views/",

    // Storybook Stories
    "\.story\.js",

    // Jest Tests
    "\.test\.js"
  ],

  // Default: ["json", "lcov", "text"]
  coverageReporters: [
    "lcov",
    "json-summary",
    "json",
    "text"
  ]
}
