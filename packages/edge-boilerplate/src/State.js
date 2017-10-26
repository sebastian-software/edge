import { counterReducer } from "./modules/Counter"
import { envReducer } from "./modules/Env"

export default {
  /**
   * Returns configuration objects for different areas of the Edge
   * powered application infrastructure.
   *
   * @param state {Object} Current application state.
   * @param topic {String} Any of "apollo", ...
   */
  getConfig(state, topic) {
    if (topic === "apollo") {
      return {
        uri: state.env.APOLLO_URL

        // headers: {},
        // batchRequests: false,
        // trustNetwork: true,
        // queryDeduplication: true
      }
    }

    return null
  },

  /**
   * Return map of routes. Match redux actions to urls.
   */
  getRoutes() {
    return {
      HOME: "/",
      COUNTER: "/counter",
      LOCALIZATION: "/localization"
    }
  },

  /**
   * Return list of Redux store enhancers to use.
   */
  getEnhancers() {
    return []
  },

  /**
   * Create mapping of reducers to use for the Redux store.
   */
  getReducers() {
    return {
      counter: counterReducer,
      env: envReducer
    }
  },

  /**
   * Create list of Redux middleware to use.
   */
  getMiddlewares() {
    return []
  }
}
