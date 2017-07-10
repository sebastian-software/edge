import express from "express"
import { addDevMiddleware } from "../express/dev"

const DEVELOPMENT_PORT = process.env.DEVELOPMENT_PORT

export function startDevServer() {
  const server = express()

  addDevMiddleware(server)

  /* eslint-disable no-console */
  server.listen(DEVELOPMENT_PORT, () => {
    console.log(`Development Server Started @ Port ${DEVELOPMENT_PORT}`)
  })

  return server
}
