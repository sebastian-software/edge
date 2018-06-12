/* eslint-disable import/no-commonjs */

const loader = require("graphql-tag/loader")

module.exports = {
  process(source) {
    return loader.call({
      cacheable() {
        // empty
      }
    }, source)
  }
}
