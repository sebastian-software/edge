// This file is just for exporting infrastructure to applications built upon this.

// Polyfill for fetch() API in NodeJS based on code from
// https://github.com/matthew-andrews/isomorphic-fetch/blob/master/fetch-npm-node.js
if (!global.fetch) {
  var realFetch = require("node-fetch")
  global.fetch = function fetch(url, options) {
    const normalized = (/^\/\//).test(url) ? `https:${url}` : url
    return realFetch.call(this, normalized, options)
  }
  global.Response = realFetch.Response
  global.Headers = realFetch.Headers
  global.Request = realFetch.Request
}

export * from "./common"
export * from "./server/loadImport"

export { default as renderPage } from "./server/renderPage"
export { default as renderApplication } from "./server/renderApplication"
export { default as getLocaleData } from "./server/getLocaleData"
export { default as prepareResponse } from "./server/prepareResponse"

export * from "./server/debug"
