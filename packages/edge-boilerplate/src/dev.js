import { resolve, dirname } from "path"
import cosmiconfig from "cosmiconfig"
import dotenv from "dotenv"
import { createExpressServer } from "edge-express"
import { createMiddleware, connectWithWebpack } from "edge-builder"

dotenv.config()

const configLoader = cosmiconfig("edge", {
  stopDir: process.cwd(),
  rcExtensions: true
})

/* eslint-disable no-console, security/detect-non-literal-require */
async function main() {
  const { config, filepath } = await configLoader.load(__dirname)
  const root = dirname(filepath)

  const { middleware, multiCompiler } = createMiddleware(config)

  const server = createExpressServer({
    staticConfig: {
      public: config.output.public,
      path: resolve(root, config.output.client)
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
