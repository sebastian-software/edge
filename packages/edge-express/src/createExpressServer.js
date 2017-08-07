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
  afterSecurity = [],
  beforeFallback = [],
  enableCSP = false,
  enableNonce = false
}) {
  // Create our express based server.
  const server = express()

  addErrorMiddleware(server)
  addSecurityMiddleware(server, { enableCSP, enableNonce })

  // Allow for some early additions for middleware
  if (afterSecurity.length > 0) {
    afterSecurity.forEach((middleware) => {
      if (middleware instanceof Array) {
        server.use(...middleware)
      } else {
        server.use(middleware)
      }
    })
  }

  addCoreMiddleware(server, { locale })

  // Configure static serving of our webpack bundled client files.
  if (folder) {
    server.use(folder.public, express.static(folder.path))
  }

  // Allow for some late additions for middleware
  if (beforeFallback.length > 0) {
    beforeFallback.forEach((middleware) => {
      if (middleware instanceof Array) {
        server.use(...middleware)
      } else {
        server.use(middleware)
      }
    })
  }

  // For all things which did not went well.
  addFallbackHandler(server)

  return server
}
