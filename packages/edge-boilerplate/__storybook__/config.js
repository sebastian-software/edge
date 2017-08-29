/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react"
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { Provider } from "react-redux"
import { configure, addDecorator } from "@storybook/react"
import { withKnobs } from "@storybook/addon-knobs"
import createHistory from "history/createMemoryHistory"
import { connectRoutes } from "redux-first-router"
import { IntlProvider } from "react-intl"
import "edge-style"

import "../src/Application.css"
import State from "../src/State"

import "./Overwrite.css"

const history = createHistory()
const routesMap = State.getRoutes()

const { reducer, middleware, enhancer } = connectRoutes(history, routesMap)

const enhancers = compose(enhancer, applyMiddleware(middleware))
const reducers = combineReducers({ location: reducer, ...State.getReducers() })
const store = createStore(reducers, {}, enhancers)

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
addDecorator(withKnobs)

addDecorator((story) => {
  return (
    <IntlProvider locale="en-US">
      <Provider store={store}>
        {story()}
      </Provider>
    </IntlProvider>
  )
})

const loader = require.context("../src/components", true, /\.story\.js$/)

function loadStories() {
  loader.keys().forEach((filename) => loader(filename))
}

configure(loadStories, module)
