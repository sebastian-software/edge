/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react"
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { Provider } from "react-redux"
import { configure, addDecorator } from "@storybook/react"
import { connectRoutes } from "redux-first-router"
import { IntlProvider } from "react-intl"

import "edge-style"

const routesMap = {
  HOME: "/"
}

const { reducer, middleware, enhancer } = connectRoutes(routesMap)

const enhancers = compose(enhancer, applyMiddleware(middleware))
const reducers = combineReducers({ location: reducer })
const store = createStore(reducers, {}, enhancers)

addDecorator((story) => {
  return (
    <IntlProvider locale="en-US">
      <Provider store={store}>{story()}</Provider>
    </IntlProvider>
  )
})

// Installed in either:
// - ROOT/node_modules/edge-storybook/lib (inside applications)
//   This is true: __dirname == "./node_modules/edge-storybook/lib"
// - ROOT/packages/edge-storybook/lib (inside edge itself)
//   This is true: __dirname == "../edge-storybook/lib"
console.log("DIRNAME:", __dirname)

const context =
  __dirname === "../edge-storybook/lib"
    ? "../../edge-boilerplate/src"
    : "../../../src"

const loader = require.context(context, true, /\.story\.js$/)

function loadStories() {
  loader.keys().forEach((filename) => loader(filename))
}

configure(loadStories, module)
