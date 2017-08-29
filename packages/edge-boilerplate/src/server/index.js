import React from "react"
import dotenv from "dotenv"

import {
  prepareResponse,
  ensureIntlSupport,
  ensureReactIntlSupport,
  wrapApplication,
  renderApplication,
  createKernel,
  fetchData
} from "edge-core"

import Application from "../Application"
import State from "../State"

dotenv.config()

// eslint-disable-next-line no-console
console.log(`[APP] Build: ${process.env.NODE_ENV}-${process.env.BUILD_TARGET}`)

/* eslint-disable no-console, max-statements */
export default ({ clientStats }) => async(request, response) => {
  // [1] Response Preparation:
  // This step parses some client information like language and user agent.
  const edge = prepareResponse(request)

  // [2] Prepare Localization Support:
  // Make sure that all required internationalization data and polyfills are ready.
  // On the server-side we estimate client-side support by querying the caniuse
  // database using the user agent passed via HTTP headers.
  const intl = edge.intl
  ensureIntlSupport(import(`lean-intl/locale-data/${intl.locale}`), intl, edge.browser)
  ensureReactIntlSupport(import(`react-intl/locale-data/${intl.language}`), intl)

  // [3] Build State:
  // Built up object which contains all relevant initial render data.
  // We can use this for passing environment settings to the client.
  // Make sure to have the matching reducer for each top-level entry.
  const state = {
    env: {
      baseApiUrl: process.env.BASE_API_URL
    }
  }

  // [4] Create Kernel Instance:
  // This one holds all current request state in an easy-accessible container.
  const kernel = createKernel(State, { state, edge, request })

  // [5] Wrap Application:
  // We wrap the original application with support for Intl, Redux, ...
  const WrappedApplication = wrapApplication(<Application />, kernel)

  // [6] Fetch Data:
  // Now we are ready to fetch required data by waiting for async requests.
  await fetchData(WrappedApplication, kernel)

  // [7] Render Application:
  // When all required data is available we can safely render the result.
  renderApplication({ Application: WrappedApplication, clientStats, kernel, request, response })
}
