import ReactDOM from "react-dom/server"
import { flushChunkNames } from "react-universal-component/server"
import flushChunks from "webpack-flush-chunks"
import { NOT_FOUND } from "redux-first-router"

import renderPage from "./renderPage"

/* eslint-disable max-params, no-console */
export default function renderApplication({
  Application,
  clientStats,
  kernel,
  request,
  response
}) {
  console.log("[EDGE] Exporting current state...")
  const state = kernel.store.getState()

  // the idiomatic way to handle routes not found :)
  // your component's should also detect this state and render a 404 scene
  const location = state.location
  let httpStatus = 200
  if (location.type === NOT_FOUND) {
    /* eslint-disable no-magic-numbers */
    httpStatus = 404
  } else if (location.kind === "redirect") {
    // By using history.replace() behind the scenes, the private URL the user
    // tried to access now becomes the /login URL in the stack, and the user
    // can go back to the previous page just as he/she would expect.
    return response.redirect(302, location.pathname)
  }

  console.log("[EDGE] Rendering application...")
  let html = ""
  try {
    html = ReactDOM.renderToString(Application)
  } catch (err) {
    console.error("Unable to render server side React:", err)
  }

  // console.log("[EDGE] Flushing chunks...")
  const chunkNames = flushChunkNames()
  console.log("[EDGE] Rendered Chunk Names:", chunkNames.join(", "))
  const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames })
  // console.log("[EDGE] Flushed Script Tags:\n" + js.toString() + "\n")
  // console.log("[EDGE] Flushed CSS Tags:\n" + styles.toString() + "\n")

  // TODO: Support SRI integrity checksums as added by SRI Webpack Plugin
  // https://www.npmjs.com/package/webpack-subresource-integrity#without-htmlwebpackplugin

  // Render full HTML page using external helper
  console.log("Rendering Page...")
  const renderedPage = renderPage({
    state,
    html,
    styles: styles.toString(),
    scripts: cssHash + js.toString()
  })

  // Make sure that the actual dynamically rendered page is never being cached
  response.setHeader("Cache-Control", "no-cache")

  // Send actual content
  console.log("[EDGE] Sending Page...")
  return response.status(httpStatus).send(renderedPage)
}
