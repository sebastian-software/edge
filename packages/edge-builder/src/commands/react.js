import createExpress from "../express/createExpressServer"

/* eslint-disable no-console */
/* eslint-disable import/no-commonjs */
/* eslint-disable security/detect-non-literal-require */

export function startReactServer(config = {}, customMiddleware = []) {
  const server = createExpress(config, customMiddleware)

  const clientStats = require(`${config.output.client}/stats.json`)
  const serverRender = require(`${config.output.server}/main.js`).default

  server.use(serverRender({
    clientStats,
    clientOutput: config.output.client
  }))

  server.listen(process.env.SERVER_PORT, () => {
    console.log(`React Server Started @ Port ${process.env.SERVER_PORT}`)
  })
}
