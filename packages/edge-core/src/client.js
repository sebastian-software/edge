// This file is just for exporting infrastructure to applications built upon this.

// Polyfill for fetch() API
// https://github.com/developit/unfetch
import "unfetch/polyfill"

// Polyfill for RequestAnimationFrame which is required since React v16
import "raf/polyfill"

export * from "./common"
export * from "./client/loadImport"

export { default as getBrowserLocale } from "./client/getBrowserLocale"
export { default as renderApp } from "./client/renderApp"
export { default as updateState } from "./client/updateState"
