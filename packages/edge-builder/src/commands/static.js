/* eslint-disable no-console */

import { static as staticMiddleware } from "express"
import { createExpressServer } from "edge-express"

export function startStaticServer(buildConfig = {}) {
  const server = createExpressServer({
    staticConfig: {
      public: buildConfig.output.public,
      path: buildConfig.output.client
    },
    localeConfig: buildConfig.locale,
    afterSecurity: [],
    beforeFallback: [
      [ "/", staticMiddleware(buildConfig.output.client) ]
    ],
    enableCSP: process.env.ENABLE_CSP,
    enableNonce: process.env.ENABLE_NONCE
  })

  server.listen(process.env.SERVER_PORT, () => {
    console.log(`Static Server Started @ Port ${process.env.SERVER_PORT}`)
  })
}
