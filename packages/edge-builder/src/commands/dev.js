import express from "express"
import chalk from "chalk"
import { addDevMiddleware } from "../express/dev"

const DEVELOPMENT_PORT = process.env.DEVELOPMENT_PORT

export function startDevServer() {
  console.log("Creating development server...")
  const server = express()

  const compiler = addDevMiddleware(server)

  let serverIsStarted = false

  /* eslint-disable no-console */
  compiler.plugin("done", (stats) => {
    if (!stats.hasErrors()) {
      console.log(chalk.green("Code compiled successfully."))

      if (!serverIsStarted) {
        serverIsStarted = true

        server.listen(DEVELOPMENT_PORT, () => {
          console.log(`Development Server Started @ Port ${DEVELOPMENT_PORT}`)
        })
      }
    } else {
      console.error("Build failed!")
    }
  })
}
