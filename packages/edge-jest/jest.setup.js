/* eslint-disable import/no-commonjs */

// Mocking all fetch() calls. Should never depend on any actual network during test.
global.fetch = require("jest-fetch-mock")

// Polyfill for RequestAnimationFrame which is required for React v16
require("raf/polyfill")
