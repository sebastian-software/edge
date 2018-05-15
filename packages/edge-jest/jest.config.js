const APP_ROOT = require("app-root-dir").get()
const path = require("path")

/* eslint-disable */
module.exports = {
  transform: {
    "^.+\\.(js|jsx|mjs)$": require.resolve("./transform/babel.js"),
    "^.+\\.(css|sss)$": require.resolve("./transform/css.js"),
    "^.+\\.(graphql|gql)$": require.resolve("./transform/graphql.js"),
    "^(?!.*\\.(js|jsx|mjs|css|sss|json|graphql|gql)$)": require.resolve("./transform/file.js")
  },

  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$",
    "^.+\\.module\\.css$"
  ],

  moduleNameMapper: {
    "^.+\\.module\\.css$": "identity-obj-proxy"
  },

  setupFiles: [
    require.resolve("./jest.setup.js")
  ],

  globals: {
    APP_ROOT: APP_ROOT,
    APP_SRC: path.join(APP_ROOT, "src"),
    APP_DIST: path.join(APP_ROOT, "dist")
  },

  collectCoverageFrom: ["src/**.js"],

  coveragePathIgnorePatterns: [
    // NPM packages
    "/node_modules/",

    // Publish Export Entries
    "src/index.js",
    "src/client.js",
    "src/server.js",
    "src/binary.js",
    "src/dev.js",

    // Webpack Entry Points
    "/client/",
    "/server/",

    // Application Glue Code
    "src/Application.js",
    "src/State.js",
    "/views/",

    // Storybook Stories
    ".story.js",

    // Jest Tests
    ".test.js"
  ],

  // Default: ["json", "lcov", "text"]
  coverageReporters: ["lcov", "json-summary", "json", "text"]
}
