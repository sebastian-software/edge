import "readable-code"
import gulp from "gulp"
import runSequence from "run-sequence"
import webpack from "webpack"
import builder from "./webpack/builder"

gulp.task("build", (callback) => {
  runSequence("build:client", "build:server", callback)
})

gulp.task("build:server", () =>
{
  const config = builder({
    target: "server",
    env: "production"
  })

  config.plugins.push(new webpack.ProgressPlugin())

  return new Promise((resolve, reject) => {
    webpack(config, (error, stats) => {
      if (error) {
        reject("Webpack Server Error:", error)
      }

      resolve()
    })
  })
})

gulp.task("build:client", () =>
{
  const config = builder({
    target: "client",
    env: "production"
  })

  config.plugins.push(new webpack.ProgressPlugin())

  return new Promise((resolve, reject) => {
    webpack(config, (error, stats) => {
      if (error) {
        reject("Webpack Client Error:", error)
      }

      resolve()
    })
  })
})
