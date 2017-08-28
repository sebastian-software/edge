import { createReduxRouter } from "./ReduxRouter"
import { createApolloClient } from "./ApolloClient"
import { createReduxStore } from "./State"
import getBrowserLocale from "../client/getBrowserLocale"

const defaultState = process.env.TARGET === "client" ? window.APP_STATE : null

/**
 *
 * @param {*} State
 * @param {*} param1
 */
export default function createKernel(State, { state = defaultState, edge, request } = {}) {
  // Use given edge instance when not already defined on state
  if (process.env.TARGET === "node" && edge != null) {
    if (!state.edge) {
      state.edge = edge
    }
  }

  if (process.env.TARGET === "web" && state.edge.intl == null) {
    console.warn("Fallback to client side locale information!")

    // FIXME: Retrieve data from build config
    const supportedLocales = []
    state.edge.intl = getBrowserLocale(supportedLocales)
  }

  let router = createReduxRouter(
    State.getRoutes(),
    request ? request.path : null
  )

  let apollo = createApolloClient({
    uri: null
  })

  let store = createReduxStore({
    reducers: State.getReducers(),
    enhancers: State.getEnhancers(),
    middlewares: State.getMiddlewares(),
    state,
    router,
    apollo
  })

  let intl = state.edge.intl

  // Kernel "Instance"
  return {
    intl,
    router,
    apollo,
    store
  }
}
