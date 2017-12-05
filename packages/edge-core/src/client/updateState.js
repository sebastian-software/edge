import { createRootReducer } from "../common/State"

export default function updateState(NextState, kernel) {
  console.log("[EDGE]: Updating application state...")
  kernel.store.replaceReducer(
    createRootReducer(NextState.getReducers(), kernel.router)
  )
}
