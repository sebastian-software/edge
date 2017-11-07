import { resolve } from "path"
import dotenv from "dotenv"
import toBool from "yn"

import { createExpressServer } from "edge-express"
import { loadConfig } from "edge-common"

dotenv.config()

/* eslint-disable no-console, security/detect-non-literal-require */
async function main() {
  const { config } = await loadConfig()

  const clientStats = require(resolve(config.output.client, "stats.json"))
  const serverRender = require(resolve(config.output.server, "main.js")).default

  const server = createExpressServer({
    staticConfig: {
      public: config.output.public,
      path: config.output.client
    },
    localeConfig: config.locale,
    afterSecurity: [],
    beforeFallback: [
      serverRender({
        clientStats
      })
    ],
    enableCSP: toBool(process.env.ENABLE_CSP),
    enableNonce: toBool(process.env.ENABLE_NONCE)
  })

  server.listen(process.env.SERVER_PORT, () => {
    console.log(`React Server Started @ Port ${process.env.SERVER_PORT}`)
  })
}

process.nextTick(main)
