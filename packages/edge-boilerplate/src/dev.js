/* eslint-disable no-console */

import dotenv from "dotenv"
import toBool from "yn"

import { createExpressServer } from "edge-express"
import { loadConfig } from "edge-common"
import { createMiddleware, connectWithWebpack } from "edge-builder"

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
    enableCSP: toBool(process.env.ENABLE_CSP),
    enableNonce: toBool(process.env.ENABLE_NONCE)
  })

  connectWithWebpack(server, multiCompiler)
}

process.nextTick(main)
