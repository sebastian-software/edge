/* global __dirname */

import webpack from "webpack"
import rimraf from "rimraf"
import { resolve } from "path"

import { full } from "../../src"

beforeEach((done) => {
  rimraf(resolve(__dirname, "dist"), done)
})

test("Executes correctly", (done) => {
  const compiler = webpack(full({ root: __dirname }))
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      // Handle errors here
      throw new Error(err)
    }
  })
  compiler.hooks.done.tap("Test", () => {
    done()
  })
})
