import areIntlLocalesSupported from "intl-locales-supported"
import { addLocaleData } from "react-intl"

const PREFER_NATIVE = true

export function requiresIntlPolyfill(locale) {
  // Determine if the built-in `Intl` has the locale data we need.
  if (PREFER_NATIVE && global.Intl && areIntlLocalesSupported([ locale ])) {
    return false
  }

  // By default Node only ships with basic English locale data. You can however build a
  // Node binary with all locale data. We recommend doing this if you control the container
  // your Node app runs in, otherwise you'll want to polyfill Intl in Node.
  // Via: https://github.com/yahoo/react-intl/wiki#i18n-in-javascript
  if (PREFER_NATIVE === false && process.env.TARGET === "node")
  {
    /* eslint-disable no-console */
    console.warn("Your NodeJS installation does not include full ICU locale data! Fallback to polyfill!")
    console.warn("See also: https://github.com/nodejs/node/wiki/Intl")
  }

  return true
}

export function installIntlPolyfill([ IntlPolyfill, intlData ]) {
  // Rewriting import() to require.ensure unfortunately does not work with ESM correctly as it seems
  const IntlPolyfillClass = IntlPolyfill.default || IntlPolyfill

  // Inject loaded locale specific data
  IntlPolyfillClass.__addLocaleData(intlData)

  // `Intl` exists, but it doesn't have the data we need, so load the
  // polyfill and patch the constructors we need with the polyfill's.
  if (global.Intl) {
    Intl.NumberFormat = IntlPolyfillClass.NumberFormat
    Intl.DateTimeFormat = IntlPolyfillClass.DateTimeFormat
  } else {
    global.Intl = IntlPolyfillClass
  }
}

export function requiresReactIntl() {
  // Locale Data in Node.js:
  // When using React Intl in Node.js (same for the Intl.js polyfill), all locale data will be
  // loaded into memory. This makes it easier to write a universal/isomorphic React app with
  // React Intl since you won't have to worry about dynamically loading locale data on the server.
  // Via: https://github.com/yahoo/react-intl/wiki#locale-data-in-nodejs

  // As mentioned above no additional data has to be loaded for NodeJS. We are just resolving
  // the Promise in that case.
  if (process.env.TARGET === "node") {
    return false
  }

  return true
}

export function installReactIntl(response) {
  addLocaleData(response)
}
