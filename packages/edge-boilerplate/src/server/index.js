import React from "react"
import { fetchData, prepareResponse, renderApplication } from "edge-core"
import { getLoadableState } from 'loadable-components/server'

import Application from "../Application"
import State from "../State"

// eslint-disable-next-line no-console
console.log(`[APP] Build: ${process.env.NODE_ENV}-${process.env.BUILD_TARGET}`)

/* eslint-disable no-console, max-statements */
export default ({ clientStats }) => async (request, response) => {
  // Response Preparation:
  // This step parses some client information like language and user agent.
  const parsed = prepareResponse(request)

  // Fetch Data:
  // Now we are ready to fetch required data by waiting for async requests.
  try {
    await fetchData(Application)
  } catch (error) {
    console.error("Unable to fetch data:", error)
  }

  // Render Application:
  // When all required data is available we can safely render the result.
  try {
    renderApplication({
      Application,
      clientStats,
      request,
      response
    })
  } catch(error) {
    console.error("Unable to render application:", error)
  }
}
