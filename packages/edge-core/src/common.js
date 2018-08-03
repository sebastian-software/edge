export {
  createReduxStore,
  createRootReducer,
  emptyReducer,
  emptyMiddleware,
  emptyEnhancer,
  edgeReducer
} from "./common/State"

export { createApolloClient } from "./common/ApolloClient"

export {
  requiresIntlPolyfill,
  installIntlPolyfill,
  requiresReactIntl,
  installReactIntl,
  getRegion,
  getLanguage,
  getLocale
} from "./common/Intl"

export { default as wrapApplication } from "./common/wrapApplication"
export { default as deepFetch } from "./common/deepFetch"
export { default as createKernel } from "./common/createKernel"
export { default as fetchData } from "./common/fetchData"
