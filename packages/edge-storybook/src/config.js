/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from "react"
import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import { Provider } from "react-redux"
import { configure, addDecorator } from "@storybook/react"
import { connectRoutes } from "redux-first-router"
import { IntlProvider, addLocaleData } from "react-intl"
import Cookie from "js-cookie"

// The "global" import fixes issues accessing globals from outside of the VM
// where this script is running. This is mainly relevant for running Storyshots via Jest.
/* eslint-disable no-global-assign, no-native-reassign */
import global from "global"

// Core Reset Styles
import "edge-style"

// Testing with Storyshots:
// Some components rely on intervals being executed at least once.
// This is also good for test coverage as it hits areas normally not hit when
// intervals are stopped before first execution.
// Note: We can't use Jest's fakeTimers as these snapshots are rendered in a
// different V8 VM where we do not have any access to the Jest API.
if (process.env.NODE_ENV === "test") {
  global.setInterval = function fakeSetInterval(callback, timeout) {
    callback()
    return 0
  }

  global.clearInterval = function fakeClearInterval() {
    // empty
  }
}

const routesMap = {
  HOME: "/"
}

const { reducer, middleware, enhancer } = connectRoutes(routesMap)

const enhancers = compose(
  enhancer,
  applyMiddleware(middleware)
)
const reducers = combineReducers({ location: reducer })
const store = createStore(reducers, {}, enhancers)

// Using same cookie as in our applications which should make it possible
// via some UI to switch between different locales.
let locale = process.env.NODE_ENV === "test" ?
  process.env.APP_DEFAULT_LOCALE : Cookie.get("locale")

if (locale == null) {
  locale = "en-US"
}

const language = locale.split("-")[0]

function boot() {
  addDecorator((story) => {
    return (
      <IntlProvider locale={locale}>
        <Provider store={store}>{story()}</Provider>
      </IntlProvider>
    )
  })

  // Uses the injected ROOT from our Webpack config to find stories
  // relative to the application folder.

  // 1. Require all initializers files e.g. core CSS required for all components, i18n setup, etc.
  const initLoader = require.context(process.env.APP_SOURCE, false, /\bInit\.js$/)
  const initializers = initLoader.keys().map(initLoader)

  console.log("Loaded", initializers.length, "initializers.")

  // 2. Find and load all stories found somewhere in the application directory.
  const storyLoader = require.context(process.env.APP_SOURCE, true, /\.story\.js$/)
  const stories = storyLoader.keys().map(storyLoader)
  configure(() => stories, module)

  console.log("Added", stories.length, "stories.")
}

if (process.env.NODE_ENV === "test") {
  // In tests we keep things static and just use the default locale
  boot()
} else {
  // Dynamically loading configured language support
  import(`react-intl/locale-data/${language}`).then(data => {
    // Access CJS data by using "default" key
    addLocaleData(data.default)
    console.log("React-Intl loaded data for", language)
    boot()
  })
}
