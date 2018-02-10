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

// Mode: Inside "edge" mono-repository
const loader = require.context("../../edge-boilerplate/src", true, /\.story\.js$/);
const stories = loader.keys()

console.log("Loading", stories.length, "stories")

function loadStories() {
  stories.forEach((filename) => loader(filename))
}

configure(loadStories, module)
