import React from "react"
import ReactDOM from "react-dom/server"
import { flushModuleIds } from "react-universal-component/server"
import flushChunks from "webpack-flush-chunks"
import AppRoot from "../src/components/App"

export default ({ clientStats, outputPath }) => (request, response, next) => {
  const renderedApp = ReactDOM.renderToString(<AppRoot />)
  const moduleIds = flushModuleIds()

  // TODO: Support SRI integrity checksums as added by SRI Webpack Plugin
  // https://www.npmjs.com/package/webpack-subresource-integrity#without-htmlwebpackplugin

  const { js, styles } = flushChunks(clientStats, {
    moduleIds,
    before: [ "bootstrap" ],
    after: [ "main" ],

    // only needed if serving css rather than an external stylesheet
    // note: during development css still serves as a stylesheet
    outputPath
  })

  response.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        ${styles}
      </head>
      <body>
        <div id="root">${renderedApp}</div>
        ${js}
      </body>
    </html>`
  )
}
