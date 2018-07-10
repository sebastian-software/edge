/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */
import Cookie from "js-cookie"

// The "global" import fixes issues accessing globals from outside of the VM
// where this script is running. This is mainly relevant for running Storyshots via Jest.
/* eslint-disable no-global-assign, no-native-reassign */
import global from "global"
import React from "react"
import { addDecorator, configure } from "@storybook/react"
import { addLocaleData, IntlProvider } from "react-intl"

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

// Activate polyfill for `require.context()` when running inside e.g. Jest/NodeJS
if (process.env.NODE_ENV === "test" && require.context == null) {
  /* global __dirname */
  require("babel-plugin-require-context-hook/register")()
  require.context = function context(directory, useSubdirectories, regExp) {
    return global.__requireContext(
      __dirname,
      directory,
      useSubdirectories,
      regExp
    )
  }
}

// Using same cookie as in our applications which should make it possible
// via some UI to switch between different locales.
let locale =
  process.env.NODE_ENV === "test" ?
    process.env.APP_DEFAULT_LOCALE :
    Cookie.get("locale")

if (locale == null) {
  locale = "en-US"
}

const language = locale.split("-")[0]

// In tests we keep things static and just use the default locale
const data = require(`react-intl/locale-data/${language}`)
addLocaleData(data)
console.log("React-Intl loaded data for", language)

// Loading messages for components from application root "messages" folder
// Expect that these messages are named `${language}.json` or `${locale}.json`.
let messageLoader
try {
  messageLoader = require.context(
    `${process.env.APP_SOURCE}/messages`,
    !1,
    /\.json$/
  )
} catch(error) {}

let messages = {}

if (messageLoader) {
  const localeMatcher = new RegExp(`${locale}\\.json$`)
  const languageMatcher = new RegExp(`${language}\\.json$`)

  const localeSpecific = messageLoader
    .keys()
    .filter((messageFile) => localeMatcher.test(messageFile))
  const languageSpecific = messageLoader
    .keys()
    .filter((messageFile) => languageMatcher.test(messageFile))

  const localeData = localeSpecific[0] ? messageLoader(localeSpecific[0]) : {}
  const languageData = languageSpecific[0] ?
    messageLoader(languageSpecific[0]) :
    {}

  // We merge the data from locale and language specific files - if both are avaible.
  // Locale specific messages override language only data.
  messages = { ...languageData, ...localeData }
}

// Decorate all stories with localization support so that FormattedMessage, etc. work correctly.
addDecorator((story) => {
  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      defaultLocale={process.env.APP_DEFAULT_LOCALE}
    >
      {story()}
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
const storyLoader = require.context(
  process.env.APP_SOURCE,
  true,
  /\.story\.js$/
)
const stories = storyLoader.keys().map(storyLoader)
configure(() => stories, module)

console.log("Added", stories.length, "stories.")
