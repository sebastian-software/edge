/* eslint-disable import/no-commonjs, filenames/match-regex */
/* global jest */

// Make sure that environment variables are available
require("universal-dotenv")

// Mocking Canvas APIs in a very lean way. We don't really need some
// Cairo based rendering at all in most test scenarios.
require("jest-canvas-mock")

// Mocking all fetch() calls. Should never depend on any actual network during test.
global.fetch = require("jest-fetch-mock")

// Rewrite console.log/debug to a mock. This shouldn't be required to run in tests
// and makes test runner output much more calm and focused. We keep warn/error and
// other not so often used methods intact.
console.clear = jest.fn()
console.log = jest.fn()
console.debug = jest.fn()

// Mock Date.now() so that all values are static
require("jest-mock-now")(new Date("2018-05-17T11:25:51.054Z"))

// Polyfill for RequestAnimationFrame which is required for React v16
require("raf/polyfill")

// Making sure that global.URL is supported by loading the Polyfill.
// This is required for some libraries like the MapBox GL API.
if (global.URL == null) {
  require("url-polyfill")
}

// Polyfill for not yet implemented parts of the URL API in NodeJS.
// See also: https://github.com/nodejs/node/issues/16167
if (URL.createObjectURL == null) {
  URL.createObjectURL = jest.fn()
  URL.revokeObjectURL = jest.fn()
}

// Mocking for Element Resize Detector which is used for responsive components
// e.g. via React Sizeme. We have to pass the factory as otherwise only the
// root function is mocked which is not enough.
try {
  jest.mock("element-resize-detector", () => {
    return () => ({
      listenTo: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
      uninstall: jest.fn()
    })
  })
} catch(error) {}
