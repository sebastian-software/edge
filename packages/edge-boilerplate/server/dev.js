import dotenv from "dotenv"
import express from "express"
import { addDevMiddleware } from "edge-builder"

// Initialize environment configuration
dotenv.config()

const DEVELOPMENT_PORT = process.env.DEVELOPMENT_PORT

const server = express()

addDevMiddleware(server)

/* eslint-disable no-console */
server.listen(DEVELOPMENT_PORT, () => {
  console.log(`Development Server Started @ Port ${DEVELOPMENT_PORT}`)
})
