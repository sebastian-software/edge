import React from "react"
import { hydrate, render } from "react-dom"

import Application from "../Application"
import State from "../State"

// eslint-disable-next-line no-console
console.log(`[APP] Build: ${process.env.NODE_ENV}-${process.env.BUILD_TARGET}`)


const root = document.getElementById("root")
hydrate(<Application/>, root)




if (process.env.NODE_ENV === "development" && module.hot) {
  // Any changes to our application will cause a hotload re-render.
  module.hot.accept("../Application", () => {
    const NextApplication = require("../Application").default
    render(<NextApplication />, root)
  })

  // Any changes to our state machinery will update the reducers.
  module.hot.accept("../State", () => {
    const NextState = require("../State").default
    updateState(NextState)
  })
}
