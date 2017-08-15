export {
  createReduxStore, createRootReducer,
  emptyReducer, emptyMiddleware, emptyEnhancer,
  edgeReducer
} from "./common/State"

export { createApolloClient } from "./common/ApolloClient"
export { createReduxRouter } from "./common/ReduxRouter"

export {
  requiresIntlPolyfill,
  installIntlPolyfill,
  requiresReactIntl,
  installReactIntl,
  getRegion, getLanguage, getLocale,
  intlReducer
} from "./common/Intl"

export { default as wrapApplication } from "./common/wrapApplication"
export { default as deepFetch } from "./common/deepFetch"
export { default as routed } from "./common/routed"

import "./common/Core.css"
