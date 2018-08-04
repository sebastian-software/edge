import React from "react"
import loadable from "loadable-components"
import { Router } from "@reach/router"
import { IntlProvider } from "react-intl"
import classnames from "classnames/bind"

import Styles from "./Application.css"
import ViewWrapper from "./components/view/ViewWrapper"

import HtmlHead from "./components/htmlhead/HtmlHead"
import Navigation from "./components/navigation/Navigation"

const Classes = classnames.bind(Styles)

/* eslint-disable no-console */

function renderIntlProvider(props) {
  const { Component, loading, error, ownProps } = props
  const { children, locale } = ownProps

  return (
    <IntlProvider messages={Component} locale={locale}>
      {children}

    </IntlProvider>
  )
}

const messages = {
  de: loadable(() => import("./messages/de.json"), { render: renderIntlProvider }),
  en: loadable(() => import("./messages/en.json"), { render: renderIntlProvider }),
  fr: loadable(() => import("./messages/fr.json"), { render: renderIntlProvider }),
  es: loadable(() => import("./messages/es.json"), { render: renderIntlProvider })
}

function IntlWrapper({ locale, children }) {
  const MessagesWrapper = messages[locale]
  return (
    <MessagesWrapper locale={locale}>{children}</MessagesWrapper>
  )
}



const HomeView = loadable(
  () => import("./views/Home/Home"),
  { render: ViewWrapper }
)

const CounterView = loadable(
  () => import("./views/Counter/Counter"),
  { render: ViewWrapper }
)

const LocalizationView = loadable(
  () => import("./views/Localization/Localization"),
  { render: ViewWrapper }
)

const MissingView = loadable(
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
      <IntlWrapper locale="de">
        <div className={Classes("root", { alive: this.state.alive })}>
          <HtmlHead />
          <Navigation />

          <main className={Styles.content}>
            <Router>
              <HomeView path="/" />
              <CounterView path="/counter" />
              <LocalizationView path="/localization" />
              <MissingView default />
            </Router>
          </main>
        </div>
      </IntlWrapper>
    )
  }
}

export default Application
