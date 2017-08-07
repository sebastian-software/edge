import express from "express"

import addSecurityMiddleware from "./addSecurityMiddleware"
import addCoreMiddleware from "./addCoreMiddleware"
import addErrorMiddleware from "./addErrorMiddleware"
import addFallbackHandler from "./addFallbackHandler"

const defaultLocale = {
  default: "en-US",
  supported: [ "en-US" ]
}

const defaultFolder = {
  public: "/static/",
  path: "build/client"
}

export default function createExpressServer({
  locale = defaultLocale,
  folder = defaultFolder,
  setupMiddleware = [],
  dynamicMiddleware = [],
  enableCSP = false,
  enableNonce = false
}) {
  // Create our express based server.
  const server = express()

  addErrorMiddleware(server)
  addSecurityMiddleware(server, { enableCSP, enableNonce })

  if (setupMiddleware.length > 0) {
    server.use(...setupMiddleware)
  }

  addCoreMiddleware(server, { locale })

  // Configure static serving of our webpack bundled client files.
  if (folder) {
    server.use(folder.public, express.static(folder.path))
  }

  if (dynamicMiddleware.length > 0) {
    server.use(...dynamicMiddleware)
  }

  // For all things which did not went well.
  addFallbackHandler(server)

  return server
}
