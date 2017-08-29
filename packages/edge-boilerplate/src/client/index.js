import { createKernel, updateState, renderApp } from "edge-core"

import State from "../State"
import Application, { prepare } from "../Application"

// eslint-disable-next-line no-console
console.log(`[APP] Build: ${process.env.NODE_ENV}-${process.env.BUILD_TARGET}`)

const kernel = createKernel(State)
prepare(kernel).then(() => renderApp(Application, kernel)).catch((error) => {
  throw new Error(`Unable to rehydrate client application: ${error}!`)
})

if (process.env.NODE_ENV === "development" && module.hot) {
  // Accept changes to the Edge-Core API, but don't have any actions to implement.
  module.hot.accept("edge-core")

  // Any changes to our application will cause a hotload re-render.
  module.hot.accept("../Application", () => {
    const NextApplication = require("../Application").default
    renderApp(NextApplication, kernel)
  })

  // Any changes to our state machinery will update the reducers.
  module.hot.accept("../State", () => {
    const NextState = require("../State").default
    updateState(NextState, kernel)
  })
}
