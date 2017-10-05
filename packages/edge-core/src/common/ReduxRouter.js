import { connectRoutes } from "redux-first-router"
import queryString from "query-string"

// eslint-disable-next-line max-params
export function createReduxRouter(routes, path = null, config = {}) {
  // match initial route to express path
  if (path) {
    config.initialEntries = [ path ]
  }

  config.querySerializer = queryString

  return connectRoutes(routes, config)
}
