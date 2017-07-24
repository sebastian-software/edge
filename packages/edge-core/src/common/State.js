import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"

import { intlReducer } from "./Intl"

const composeEnhancers = (process.env.TARGET === "web" &&
  process.env.NODE_ENV === "development" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

/**
 * Placeholder for a non active reducer in Redux.
 *
 * @param previousState {Object} Previous state.
 * @param action {string} Action which is being dispatched.
 */
export function emptyReducer(previousState = {}, action) {
  return previousState
}


/**
 * Placeholder for a non active middleware in Redux.
 *
 * @param store {Object} Store object to work with.
 */
export function emptyMiddleware(store) {
  return (next) => {
    return (action) => {
      return next(action)
    }
  }
}


/**
 * Placeholder for a non active enhancer in Redux.
 */
export function emptyEnhancer(param) {
  return param
}


/**
 * Dummy reducer for exporting Edge Platform specific server-side data
 * to the client-side application.
 */
export function edgeReducer(previousState = {}, action) {
  return previousState
}




/**
 * Selector for quering the nonce which must be used for injecting script tags.
 */
export function getNonce(state) {
  return state.edge.nonce
}


/**
 * Bundles the given reducers into a root reducer for the application
 */
export function createRootReducer(reducers, reduxRouter = null, apolloClient = null) {
  const allReducers = {
    // Application specific reducers
    ...reducers,

    // Edge Platform Data
    edge: edgeReducer,

    // Localization Support
    intl: intlReducer
  }

  // Integration point for Redux First Router
  if (reduxRouter) {
    allReducers.location = reduxRouter.reducer
  }

  // Support for Apollo-based GraphQL backends
  if (apolloClient) {
    allReducers.apollo = apolloClient.reducer()
  }

  return combineReducers(allReducers)
}


/**
 *
 *
 */
export function createReduxStore(config = {}) {
  const {
    reducers = {},
    middlewares = [],
    enhancers = [],
    initialState = {},
    reduxRouter = null,
    apolloClient = null
  } = config

  const rootReducer = createRootReducer(reducers, reduxRouter, apolloClient)

  const rootEnhancers = composeEnhancers(
    applyMiddleware(
      apolloClient ? apolloClient.middleware() : emptyMiddleware,

      // Redux middleware that spits an error on you when you try to mutate
      // your state either inside a dispatch or between dispatches.
      // https://github.com/leoasis/redux-immutable-state-invariant
      process.env.NODE_ENV === "development" ?
        require("redux-immutable-state-invariant").default() : emptyMiddleware,

      // Basic Promise based async handling
      thunk,

      // Redux Router First Middleware
      reduxRouter ? reduxRouter.middleware : emptyMiddleware,

      // Application specific middlewares
      ...middlewares,

      // Add automatic state change logging for client application
      // Note: Logger must be the last middleware in chain, otherwise it will log thunk and
      // promise, not actual actions (https://github.com/evgenyrodionov/redux-logger/issues/20).
      process.env.TARGET === "web" ?
        require("redux-logger").createLogger({ collapsed: true }) : emptyMiddleware
    ),

    // Redux First Router Enhancer
    reduxRouter ? reduxRouter.enhancer : emptyEnhancer,

    // Application specific enhancers
    ...enhancers
  )

  const store = createStore(
    rootReducer,
    initialState,
    rootEnhancers
  )

  return store
}
