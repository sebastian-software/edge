import { resolve } from "path"
import { get as getRoot } from "app-root-dir"
import dotenv from "dotenv"
import express from "express"

// Initialize environment configuration
dotenv.config()

const ROOT = getRoot()
const SERVER_OUTPUT = resolve(ROOT, process.env.SERVER_OUTPUT)
const CLIENT_OUTPUT = resolve(ROOT, process.env.CLIENT_OUTPUT)
const PUBLIC_PATH = process.env.PUBLIC_PATH
const PRODUCTION_PORT = process.env.PRODUCTION_PORT

/* eslint-disable no-console */
/* eslint-disable import/no-commonjs */
/* eslint-disable security/detect-non-literal-require */

export function startReactServer() {
  const server = express()

  const clientStats = require(`${CLIENT_OUTPUT}/stats.json`)
  const serverRender = require(`${SERVER_OUTPUT}/main.js`).default

  server.use(PUBLIC_PATH, express.static(CLIENT_OUTPUT))
  server.use(serverRender({ clientStats, CLIENT_OUTPUT }))

  server.listen(PRODUCTION_PORT, () => {
    console.log(`React Server Started @ Port ${PRODUCTION_PORT}`)
  })
}
