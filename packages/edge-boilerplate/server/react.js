import express from "express"
import { CLIENT_OUTPUT, SERVER_OUTPUT, PUBLIC_PATH, PRODUCTION_PORT } from "../config"

/* eslint-disable no-console */
/* eslint-disable import/no-commonjs */
/* eslint-disable security/detect-non-literal-require */

const server = express()

const clientStats = require(`${CLIENT_OUTPUT}/stats.json`)
const serverRender = require(`${SERVER_OUTPUT}/main.js`).default

server.use(PUBLIC_PATH, express.static(CLIENT_OUTPUT))
server.use(serverRender({ clientStats, CLIENT_OUTPUT }))

server.listen(PRODUCTION_PORT, () => {
  console.log(`React Server Started @ Port ${PRODUCTION_PORT}`)
})
