import "isomorphic-fetch"
import areIntlLocalesSupported from "intl-locales-supported"
import { addLocaleData } from "react-intl"

const PREFER_NATIVE = false

export function injectCode({ code, url, nonce }) {
  if (process.env.TARGET === "web") {
    return new Promise((resolve, reject) => {
      var result = false
      var injectReference = document.getElementsByTagName("script")[0]
      var scriptElem = document.createElement("script")

      if (url) {
        scriptElem.src = url
      } else if (code) {
        scriptElem.innerText = code
      }

      scriptElem.async = true

      if (nonce) {
        scriptElem.setAttribute("nonce", nonce)
      }

      scriptElem.onload = scriptElem.onreadystatechange = () => {
        if (!result && (!this.readyState || this.readyState === "complete")) {
          result = true
          resolve(true)
        }
      }
      scriptElem.onerror = scriptElem.onabort = reject
      injectReference.parentNode.insertBefore(scriptElem, injectReference)
    })
  } else {
    /* eslint-disable no-new-func */
    new Function(code)()
    return Promise.resolve(true)
  }
}

export function ensureReactIntlSupport(language, nonce = "") {
  // Locale Data in Node.js:
  // When using React Intl in Node.js (same for the Intl.js polyfill), all locale data will be
  // loaded into memory. This makes it easier to write a universal/isomorphic React app with
  // React Intl since you won't have to worry about dynamically loading locale data on the server.
  // Via: https://github.com/yahoo/react-intl/wiki#locale-data-in-nodejs

  // As mentioned above no additional data has to be loaded for NodeJS. We are just resolving
  // the Promise in that case.
  if (process.env.TARGET === "node") {
    return Promise.resolve(false)
  }

  const reactIntlUrl = require("!file-loader!react-intl/locale-data/" + language + ".js")
  console.log("Loading React-Intl Data:", reactIntlUrl)
  return fetch(reactIntlUrl).then((response) => {
    return response.text().then((code) => {
      // This stuff is crappy but it's a way to work with the UMD packages of React-Intl.
      // See also: https://github.com/yahoo/react-intl/issues/853
      injectCode({ code })
      addLocaleData(ReactIntlLocaleData[language])
    })
  })
}

export function ensureIntlSupport(locale, nonce = "") {
  // Determine if the built-in `Intl` has the locale data we need.
  if (PREFER_NATIVE && global.Intl && areIntlLocalesSupported([ locale ])) {
    return Promise.resolve(false)
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

  const intlUrl = require("!file-loader!lean-intl/locale-data/" + locale + ".json")

  return import("lean-intl").then((IntlPolyfill) => {
    console.log("Loading Lean-Intl Data:", intlUrl)
    return fetch(intlUrl).then((response) => {
      return response.json().then((parsed) => {
        IntlPolyfill.__addLocaleData(parsed)

        // `Intl` exists, but it doesn't have the data we need, so load the
        // polyfill and patch the constructors we need with the polyfill's.
        if (global.Intl) {
          Intl.NumberFormat = IntlPolyfill.NumberFormat
          Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
        } else {
          global.Intl = IntlPolyfill
        }

        return Promise.resolve(true)
      })
    })
  })
}
