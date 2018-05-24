/* eslint-disable import/no-commonjs */

// Mocking all fetch() calls. Should never depend on any actual network during test.
global.fetch = require("jest-fetch-mock")

// Mock Date.now() so that all values are static
require("jest-mock-now")(new Date("2018-05-17T11:25:51.054Z"))

// Polyfill for RequestAnimationFrame which is required for React v16
require("raf/polyfill")
