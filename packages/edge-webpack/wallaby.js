/* eslint-disable filenames/match-exported, import/no-commonjs */
module.exports = function config(wallaby) {
  return {
    files: [ "src/**/*.js" ],

    tests: [ "__tests__/**/*.test.js" ],

    env: {
      type: "node",
      runner: "node"
    },

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },

    testFramework: "jest"
  }
}
