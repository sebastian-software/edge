import "readable-code"
import gulp from "gulp"
import runSequence from "run-sequence"
import webpack from "webpack"
import builder from "./webpack/builder"

gulp.task("build", (callback) => {
  runSequence("build:client", "build:server", callback)
})

function checkStats(stats, resolve, reject)
{
  if (stats.hasErrors() || stats.hasWarnings())
  {
    const jsonStats = stats.toJson()

    if (jsonStats.errors.length) {
      console.log("ERRORS:")
      console.log(jsonStats.errors.forEach((entry) => console.error("- ERROR:", entry)))
    }

    if (jsonStats.warnings.length) {
      console.log("WARNINGS:")
      console.log(jsonStats.warnings.forEach((entry) => console.warn("- WARNING:", entry)))
    }

    if (jsonStats.errors.length) {
      return reject("There were errors during compilation!")
    }
  }

  resolve()
}

gulp.task("build:server", () =>
{
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
})

gulp.task("build:client", () =>
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
})
