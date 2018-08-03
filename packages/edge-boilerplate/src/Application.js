import React from "react"
import loadable from "loadable-components"
import { Router } from "@reach/router"
import classnames from "classnames/bind"

import Styles from "./Application.css"
import ViewWrapper from "./components/view/ViewWrapper"

import HtmlHead from "./components/htmlhead/HtmlHead"
import Navigation from "./components/navigation/Navigation"

const Classes = classnames.bind(Styles)

/* eslint-disable no-console */

const HomeRoute = loadable(
  () => import("./views/Home/Home"),
  { render: ViewWrapper }
)

const CounterRoute = loadable(
  () => import("./views/Counter/Counter"),
  { render: ViewWrapper }
)

const LocalizationRoute = loadable(
  () => import("./views/Localization/Localization"),
  { render: ViewWrapper }
)

const MissingRoute = loadable(
  () => import("./views/Missing/Missing"),
  { render: ViewWrapper }
)

export function prepare(kernel) {
  return Promise.all([
  ])
}

/* eslint-disable react/prefer-stateless-function */
class Application extends React.Component {
  state = {
    alive: false
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({
        alive: true
      })
    })
  }

  render() {
    return (
      <Router>
        <div className={Classes("root", { alive: this.state.alive })}>
          <HtmlHead />
          <Navigation />

          <main className={Styles.content}>
            <HomeRoute />
            <CounterRoute />
            <LocalizationRoute />
            <MissingRoute />
          </main>
        </div>
      </Router>
    )
  }
}

export default Application
