import express from "express"
import { CLIENT_OUTPUT, PUBLIC_PATH, PRODUCTION_PORT } from "../config"

/* eslint-disable no-console */
/* eslint-disable import/no-commonjs */

const server = express()

const clientStats = require("../build/client/stats.json")
const serverRender = require("../build/server/main.js").default

server.use(PUBLIC_PATH, express.static(CLIENT_OUTPUT))
server.use(serverRender({ clientStats, CLIENT_OUTPUT }))

server.listen(PRODUCTION_PORT, () => {
  console.log(`React Server Started @ Port ${PRODUCTION_PORT}`)
})
