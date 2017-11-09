/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react"
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { Provider } from "react-redux"
import { configure, addDecorator } from "@storybook/react"
import { connectRoutes } from "redux-first-router"
import { IntlProvider } from "react-intl"

import "@coliquio/core-styles"

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
      <Provider store={store}>
        {story()}
      </Provider>
    </IntlProvider>
  )
})

// Installed in ROOT/node_modules/storybook-config/lib
const loader = require.context("../../../src", true, /\.story\.js$/)

function loadStories() {
  loader.keys().forEach((filename) => loader(filename))
}

configure(loadStories, module)
