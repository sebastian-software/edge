import express from "express"
import { addDevMiddleware } from "../express/dev"

const DEVELOPMENT_PORT = process.env.DEVELOPMENT_PORT

export function startDevServer() {
  console.log("Creating development server...")
  const server = express()

  const compiler = addDevMiddleware(server)

  /* eslint-disable no-console */
  compiler.plugin("done", (stats) => {
    if (!stats.hasErrors()) {
      console.log("Code compiled successfully.")

      server.listen(DEVELOPMENT_PORT, () => {
        console.log(`Development Server Started @ Port ${DEVELOPMENT_PORT}`)
      })
    } else {
      console.log("!!! Errors")
    }
  })
}
