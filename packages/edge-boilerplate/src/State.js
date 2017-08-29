import { counterReducer } from "./modules/Counter"
import { envReducer } from "./modules/Env"

export default {
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
