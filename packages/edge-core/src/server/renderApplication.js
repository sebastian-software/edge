import { renderToString } from "react-dom/server"
import flushChunks from "webpack-flush-chunks"

import renderPage from "./renderPage"

/* eslint-disable max-params, no-console */
export default function renderApplication({
  Application,
  clientStats,
  kernel,
  request,
  response
}) {
  console.log("[EDGE] Rendering application...")
  let html = ""
  try {
    html = renderToString(Application)
  } catch (err) {
    console.error("Unable to render server side React:", err)
  }

  const { js, styles } = flushChunks(clientStats)

  // TODO: Support SRI integrity checksums as added by SRI Webpack Plugin
  // https://www.npmjs.com/package/webpack-subresource-integrity#without-htmlwebpackplugin

  console.log("HTML:",html)

  // Render full HTML page using external helper
  console.log("Rendering Page...")
  const renderedPage = renderPage({
    html,
    styles: styles.toString(),
    scripts: js.toString()
  })

  // Make sure that the actual dynamically rendered page is never being cached
  response.setHeader("Cache-Control", "no-cache")

  // Send actual content
  console.log("[EDGE] Sending Page...")
  return response.status(200).send(renderedPage)
}
