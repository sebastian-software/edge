/* eslint-disable no-console */

import dotenv from "dotenv"
import { createExpressServer } from "edge-express"
import { loadConfig, createMiddleware, connectWithWebpack } from "edge-builder"

dotenv.config()

async function main() {
  const { config } = await loadConfig()
  const { middleware, multiCompiler } = createMiddleware(config)

  const server = createExpressServer({
    staticConfig: {
      public: config.output.public,
      path: config.output.client
    },
    localeConfig: config.locale,
    afterSecurity: [],
    beforeFallback: [ ...middleware ],
    enableCSP: process.env.ENABLE_CSP !== "false",
    enableNonce: process.env.ENABLE_NONCE !== "false"
  })

  connectWithWebpack(server, multiCompiler)
}

process.nextTick(main)
