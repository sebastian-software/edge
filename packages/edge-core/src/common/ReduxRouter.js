import { connectRoutes } from "redux-first-router"

/* eslint-disable import/no-commonjs */
const createHistory = process.env.TARGET === "web" ?
  require("history/createBrowserHistory").default :
  require("history/createMemoryHistory").default

const history = createHistory()

export function createReduxRouter(routes, config = {}) {
  return connectRoutes(history, routes)
}
