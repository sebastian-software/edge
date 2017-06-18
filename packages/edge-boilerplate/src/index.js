import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"

const render = (App) => ReactDOM.render(
  (
    <App />
  ),
  document.getElementById("root"),
)

if (process.env.NODE_ENV === "development") {
  module.hot.accept("./components/App.js", () => {
    const App = require("./components/App").default
    render(App)
  })
}

render(App)
