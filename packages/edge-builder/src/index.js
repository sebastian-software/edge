import { cleanClient, cleanServer, buildClient, buildServer } from "./commands/build"
import { startDevServer, addDevMiddleware } from "./commands/dev"

export {
  addDevMiddleware,
  cleanClient, cleanServer, buildClient, buildServer,
  startDevServer
}
