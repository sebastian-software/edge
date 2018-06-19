module.exports = function(wallaby) {
  return {
    files: [ "src/**/*.js" ],

    tests: [ "src/**/*.test.js", "__tests__/**/*.test.js" ],

    env: {
      type: "node",
      runner: "node"
    },

    testFramework: "jest"
  }
}
