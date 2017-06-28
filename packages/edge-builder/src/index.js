import gulp from "gulp"
import runSequence from "run-sequence"
import webpack from "webpack"
import builder from "./builder"
import { addDevMiddleware } from "./express/dev"
import { removeSync } from "fs-extra"
import dotenv from "dotenv"
import express from "express"

export { addDevMiddleware }

// Initialize environment configuration
dotenv.config()

const DEVELOPMENT_PORT = process.env.DEVELOPMENT_PORT

function checkStats(stats, resolve, reject)
{
  if (stats.hasErrors() || stats.hasWarnings())
  {
    const jsonStats = stats.toJson()

    if (jsonStats.errors.length) {
      console.log("ERRORS:")
      jsonStats.errors.forEach((entry) => console.error("- ERROR:", entry))
    }

    if (jsonStats.warnings.length) {
      console.log("WARNINGS:")
      jsonStats.warnings.forEach((entry) => console.warn("- WARNING:", entry))
    }

    if (jsonStats.errors.length) {
      reject("There were errors during compilation!")
      return
    }
  }

  resolve()
}

export function buildClient()
{
  const config = builder({
    target: "client",
    env: "production"
  })

  return new Promise((resolve, reject) =>
  {
    webpack(config, (fatalError, stats) =>
    {
      if (fatalError) {
        reject("Webpack Client Error:", fatalError)
      } else {
        checkStats(stats, resolve, reject)
      }
    })
  })
}

export function buildServer() {
  const config = builder({
    target: "server",
    env: "production"
  })

  return new Promise((resolve, reject) => {
    webpack(config, (fatalError, stats) => {
      if (fatalError) {
        reject("Webpack Server Error:", fatalError)
      } else {
        checkStats(stats, resolve, reject)
      }
    })
  })
}

export function cleanServer() {
  removeSync("./build/server")
}

export function cleanClient() {
  removeSync("./build/client")
}

export function startDevServer() {
  const server = express()

  addDevMiddleware(server)

  /* eslint-disable no-console */
  server.listen(DEVELOPMENT_PORT, () => {
    console.log(`Development Server Started @ Port ${DEVELOPMENT_PORT}`)
  })

  return server
}

export function addGulpTasks() {
  gulp.task("clean:server", cleanServer)
  gulp.task("clean:client", cleanClient)
  gulp.task("build:server", [ "clean:server" ], buildServer)
  gulp.task("build:client", [ "clean:client" ], buildClient)
  gulp.task("build", (callback) => {
    runSequence("build:client", "build:server", callback)
  })
  gulp.task("start:dev", startDevServer)
}
