import { resolve } from "path"
import { get as getRoot } from "app-root-dir"
import dotenv from "dotenv"

import createExpress from "../express/createExpressServer"

/* eslint-disable no-console */
/* eslint-disable import/no-commonjs */
/* eslint-disable security/detect-non-literal-require */

export function startReactServer(config = {}) {
  const server = createExpress(config)

  const clientOutput = resolve(getRoot(), config.clientOutput)
  const serverOutput = resolve(getRoot(), config.serverOutput)

  const clientStats = require(`${clientOutput}/stats.json`)
  const serverRender = require(`${serverOutput}/main.js`).default

  server.use(serverRender({ clientStats, clientOutput }))

  server.listen(process.env.SERVER_PORT, () => {
    console.log(`React Server Started @ Port ${process.env.SERVER_PORT}`)
  })
}
