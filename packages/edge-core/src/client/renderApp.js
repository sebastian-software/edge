import React from "react"
import { render } from "react-dom"

import wrapApplication from "../common/wrapApplication"

export default function renderApp(Application, kernel) {
  console.log("[EDGE]: Rendering application...")
  render(wrapApplication(<Application />, kernel), document.getElementById("root"))
}
