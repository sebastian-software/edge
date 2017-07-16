export {
  createReduxStore, createRootReducer,
  emptyReducer, emptyMiddleware, emptyEnhancer,
  edgeReducer,
  getRegion, getLanguage, getLocale
} from "./common/State"

export { default as wrapApplication } from "./common/wrapApplication"
export { default as deepFetch } from "./common/deepFetch"
export { createApolloClient } from "./common/Apollo"
export { ensureIntlSupport, ensureReactIntlSupport } from "./common/Intl"
