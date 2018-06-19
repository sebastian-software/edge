/* global __dirname */

import webpack from "webpack"
import rimraf from "rimraf"

import { full } from "../../src"

beforeAll((done) => {
  rimraf("dist", done)
})

test("Executes correctly", () => {
  return new Promise((resolve, reject) => {
    const compiler = webpack(full({ root: __dirname }))
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        // Handle errors here
        reject(err)
      }

      resolve()
    })
  })

})
