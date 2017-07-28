import { connectRoutes } from "redux-first-router"

/* eslint-disable import/no-commonjs */
const createHistory = process.env.TARGET === "web" ?
  require("history/createBrowserHistory").default :
  require("history/createMemoryHistory").default

export function createReduxRouter(routes, path = null, config = {}) {
  // match initial route to express path
  const history = path ? createHistory({
    initialEntries: [ path ]
  }) : createHistory()

  return connectRoutes(history, routes)
}
