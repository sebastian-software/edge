/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react"
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { Provider } from "react-redux"
import { configure, addDecorator } from "@storybook/react"
import { connectRoutes } from "redux-first-router"
import { IntlProvider } from "react-intl"

import "edge-style"

if (typeof global.APP_SRC !== "string") {
  // The "global" import fixes issues accessing globals from outside of the VM
  // where this script is running. This is mainly relevant for running Storyshots via Jest.
  /* eslint-disable no-global-assign, no-native-reassign */
  global = require("global")

  if (typeof global.APP_SRC !== "string") {
    throw new Error("Edge-Storybook: Configuration Error: APP_SRC is required to be defined by the environment!")
  }
}

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

// Uses the injected ROOT from our Webpack config to find stories
// relative to the application folder.
const loader = require.context(global.APP_SRC, true, /\.story\.js$/);
const stories = loader.keys()

console.log("Adding", stories.length, "stories from", global.APP_SRC)

function loadStories() {
  stories.forEach((filename) => loader(filename))
}

configure(loadStories, module)
