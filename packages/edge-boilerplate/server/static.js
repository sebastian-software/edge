import express from "express"

import configBuilder from "../webpack/builder"
const clientConfig = configBuilder({
  target: "client",
  env: "production"
})

const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path

const server = express()

const PORT = 3000

console.log("Public-Path:", publicPath)
console.log("Output-Path:", outputPath)

server.use("/", express.static(outputPath))
server.use(publicPath, express.static(outputPath))

server.listen(PORT, () => {})
