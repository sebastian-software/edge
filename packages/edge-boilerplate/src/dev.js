import { resolve, dirname } from "path"
import dotenv from "dotenv"
import { createExpressServer } from "edge-express"
import { loadConfig, createMiddleware, connectWithWebpack } from "edge-builder"

dotenv.config()

/* eslint-disable no-console, security/detect-non-literal-require */
async function main() {
  const { config, root } = await loadConfig()

  console.log("ROOT:", root)
  console.log("CONFIG:", config)
  return

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

  server.listen(process.env.SERVER_PORT, () => {
    console.log(`React Server Started @ Port ${process.env.SERVER_PORT}`)
  })
}

process.nextTick(main)
