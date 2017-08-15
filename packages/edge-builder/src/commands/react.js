/* eslint-disable no-console, import/no-commonjs, security/detect-non-literal-require */

import { createExpressServer } from "edge-express"

export function startReactServer(buildConfig = {}) {
  const clientStats = require(`${buildConfig.output.client}/stats.json`)
  const serverRender = require(`${buildConfig.output.server}/main.js`).default

  const server = createExpressServer({
    staticConfig: {
      public: buildConfig.output.public,
      path: buildConfig.output.client
    },
    localeConfig: buildConfig.locale,
    afterSecurity: [],
    beforeFallback: [
      serverRender({
        clientStats,
        clientOutput: buildConfig.output.client
      })
    ],
    enableCSP: process.env.ENABLE_CSP !== "false",
    enableNonce: process.env.ENABLE_NONCE !== "false"
  })

  server.listen(process.env.SERVER_PORT, () => {
    console.log(`React Server Started @ Port ${process.env.SERVER_PORT}`)
  })
}
