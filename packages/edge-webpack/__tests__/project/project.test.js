/* global __dirname */

import { join, resolve } from "path"
import { readdirSync, readFileSync } from "fs"
import rimraf from "rimraf"
import webpack from "webpack"

process.env.NODE_ENV = "production"

/* eslint-disable-next-line import/no-commonjs */
const edge = require("../../src")

const config = edge.full({ root: __dirname, quiet: true })

beforeEach((done) => {
  rimraf(resolve(__dirname, "dist"), done)
})

test("Executes correctly", (done) => {
  const compiler = webpack(config)
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      // Handle errors here
      throw new Error(err)
    }

    const dist = join(__dirname, "dist")

    expect(readdirSync(dist)).toMatchSnapshot("dirlist")
    expect(readFileSync(`${dist}/index.html`, "utf-8")).toMatchSnapshot("htmlfile")
    expect(readFileSync(`${dist}/file-1UZ6YEQK.svg`, "utf-8")).toMatchSnapshot("logofile")
  })

  compiler.hooks.done.tap("Test", () => {
    setTimeout(done, 2000)
  })
})
