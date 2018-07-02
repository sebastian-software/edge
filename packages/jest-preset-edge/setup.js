/* eslint-disable import/no-commonjs, filenames/match-regex */
/* global jest */

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
