import { resolve, dirname } from "path"
import cosmiconfig from "cosmiconfig"
import dotenv from "dotenv"
import { createExpressServer } from "edge-express"

dotenv.config()

const configLoader = cosmiconfig("edge", {
  stopDir: process.cwd(),
  rcExtensions: true
})

const enableNonce = process.env.ENABLE_NONCE === "true"
const enableCSP = process.env.ENABLE_CSP === "true"

/* eslint-disable no-console, security/detect-non-literal-require */
async function main() {
  const { config, filepath } = await configLoader.load(__dirname)
  const root = dirname(filepath)

  const clientOutput = resolve(root, config.output.client)
  const serverOutput = resolve(root, config.output.server)

  const clientStats = require(`${clientOutput}/stats.json`)
  const serverRender = require(`${serverOutput}/main.js`).default

  const server = createExpressServer({
    staticConfig: {
      public: config.output.public,
      path: clientOutput
    },
    localeConfig: config.locale,
    afterSecurity: [],
    beforeFallback: [
      serverRender({
        clientStats
      })
    ],
    enableCSP,
    enableNonce
  })

  server.listen(process.env.SERVER_PORT, () => {
    console.log(`React Server Started @ Port ${process.env.SERVER_PORT}`)
  })
}

process.nextTick(main)
