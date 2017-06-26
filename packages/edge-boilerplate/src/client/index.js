import React from "react"
import ReactDOM from "react-dom"
import AppRoot from "../components/App"

function render(MyRoot) {
  var content = <MyRoot />
  ReactDOM.render(content, document.getElementById("root"))
}

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("../components/App.js", () => {
    const NextRoot = require("../components/App").default
    render(NextRoot)
  })
}

render(AppRoot)
