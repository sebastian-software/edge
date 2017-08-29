import React from "react"
import universal from "react-universal-component"
import { NOT_FOUND } from "redux-first-router"
import { ensureIntlSupport, ensureReactIntlSupport, routed } from "edge-core"
import classnames from "classnames/bind"

import Styles from "./Application.css"

import HtmlHead from "./components/htmlhead/HtmlHead"
import Navigation from "./components/navigation/Navigation"

const Classes = classnames.bind(Styles)

/* eslint-disable no-console */

const HomeRoute = routed(
  universal(() => import("./views/Home/Home")),
  "HOME"
)

const CounterRoute = routed(
  universal(() => import("./views/Counter/Counter")),
  "COUNTER"
)

const LocalizationRoute = routed(
  universal(() => import("./views/Localization/Localization")),
  "LOCALIZATION"
)

const MissingRoute = routed(
  universal(() => import("./views/Missing/Missing")),
  NOT_FOUND
)

export function prepare(kernel) {
  const intl = kernel.intl
  return Promise.all([
    ensureIntlSupport(import(`lean-intl/locale-data/${intl.locale}`), intl),
    ensureReactIntlSupport(import(`react-intl/locale-data/${intl.language}`), intl)
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
      <div className={Classes("root", { alive: this.state.alive })}>
        <HtmlHead />
        <Navigation/>

        <main className={Styles.content}>
          <HomeRoute />
          <CounterRoute />
          <LocalizationRoute />
          <MissingRoute />
        </main>
      </div>
    )
  }
}

export default Application
