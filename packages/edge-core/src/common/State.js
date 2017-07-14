import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"

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
 * Dummy reducer for exporting server-side data to the client-side application.
 */
export function edgeReducer(previousState = {}, action) {
  return previousState
}


/**
 * Selector for quering the current locale e.g. de-DE, en-US, ...
 */
export function getLocale(state) {
  return state.edge.locale
}


/**
 * Selector for quering the current language e.g. de, en, fr, es, ...
 */
export function getLanguage(state) {
  return state.edge.language
}


/**
 * Selector for quering the current region e.g. DE, BR, PT, ...
 */
export function getRegion(state) {
  return state.edge.region
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
export function createRootReducer(reducers) {
  return combineReducers({
    ...reducers,
    edge: edgeReducer
  })
}


/**
 *
 *
 */
export function createReduxStore(config = {}) {
  const { reducers = {}, middlewares = [], enhancers = [], initialState, apolloClient } = config

  const rootReducer = apolloClient ?
    createRootReducer({ ...reducers, apollo: apolloClient.reducer() }) :
    createRootReducer(reducers)

  const rootEnhancers = composeEnhancers(
    applyMiddleware(
      apolloClient ? apolloClient.middleware() : emptyMiddleware,

      // Redux middleware that spits an error on you when you try to mutate
      // your state either inside a dispatch or between dispatches.
      // https://github.com/leoasis/redux-immutable-state-invariant
      process.env.NODE_ENV === "development" ?
        require("redux-immutable-state-invariant").default() : emptyMiddleware,

      thunk,
      ...middlewares,

      // Add automatic state change logging for client application
      // Note: Logger must be the last middleware in chain, otherwise it will log thunk and
      // promise, not actual actions (https://github.com/evgenyrodionov/redux-logger/issues/20).
      process.env.TARGET === "web" ?
        require("redux-logger").createLogger({ collapsed: true }) : emptyMiddleware
    ),
    ...enhancers
  )

  const store = createStore(
    rootReducer,
    initialState,
    rootEnhancers
  )

  return store
}
