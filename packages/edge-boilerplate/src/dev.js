/* eslint-disable no-console */

import { connectWithWebpack, createMiddleware } from "edge-builder"
import { createExpressServer } from "edge-express"
import { loadConfig } from "edge-common"
import "universal-dotenv"

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
    beforeFallback: [ ...middleware ]
  })

  connectWithWebpack(server, multiCompiler)
}

process.nextTick(main)
