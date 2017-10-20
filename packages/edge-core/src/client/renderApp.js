import React from "react"
import { hydrate } from "react-dom"

import wrapApplication from "../common/wrapApplication"

export default function renderApp(Application, kernel) {
  console.log("[EDGE]: Rendering application...")
  hydrate(wrapApplication(<Application />, kernel), document.getElementById("root"))
}
