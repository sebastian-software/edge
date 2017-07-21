import { resolve } from "path"
import { get as getRoot } from "app-root-dir"
import dotenv from "dotenv"
import express from "express"

import createExpress from "../express/createExpressServer"

// Initialize environment configuration
dotenv.config()

const ROOT = getRoot()
const CLIENT_OUTPUT = resolve(ROOT, process.env.CLIENT_OUTPUT)
const PUBLIC_PATH = process.env.PUBLIC_PATH
const PRODUCTION_PORT = process.env.PRODUCTION_PORT

/* eslint-disable no-console */

export function startStaticServer() {
  const server = createExpress({})

  server.use("/", express.static(CLIENT_OUTPUT))
  server.use(PUBLIC_PATH, express.static(CLIENT_OUTPUT))

  server.listen(PRODUCTION_PORT, () => {
    console.log(`Static Server Started @ Port ${PRODUCTION_PORT}`)
  })
}
