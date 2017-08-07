import express from "express"
import { createExpress } from "edge-server"

/* eslint-disable no-console */
export function startStaticServer(config = {}, customMiddleware = []) {
  const server = createExpress(config, customMiddleware)

  // TODO: Match all possible routes
  server.use("/", express.static(config.output.client))

  server.listen(process.env.SERVER_PORT, () => {
    console.log(`Static Server Started @ Port ${process.env.SERVER_PORT}`)
  })
}
