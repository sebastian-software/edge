import { resolve } from "path"
import { get as getRoot } from "app-root-dir"
import dotenv from "dotenv"
import express from "express"

import createExpress from "../express/createExpressServer"

/* eslint-disable no-console */
export function startStaticServer(config = {}) {
  const server = createExpress(config)
  const clientOutput = resolve(getRoot(), config.clientOutput)

  // TODO: Match all possible routes
  server.use("/", express.static(clientOutput))

  server.listen(process.env.SERVER_PORT, () => {
    console.log(`Static Server Started @ Port ${process.env.SERVER_PORT}`)
  })
}
