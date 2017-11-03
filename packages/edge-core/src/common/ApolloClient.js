import { ApolloClient } from "apollo-client"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import { setContext } from "apollo-link-context"

if (process.env.NODE_ENV === "test") {
  global.fetch = require("jest-fetch-mock")
}

export function createApolloClient(config = {}) {
  const {
    uri = null,
    getAuthHeader = null,
    trustNetwork = true,
    clientOptions = {},
    linkOptions = {}
  } = config

  if (uri == null) {
    return null
  }

  var finalLinkOptions = {
    // Based on user given options
    ...linkOptions,

    // Use pre-defined URI, the only non optional parameter if Apollo should be enabled.
    uri,

    // Fetch Credentials:
    // - omit: Never send cookies.
    // - same-origin: Send user credentials (cookies, basic http auth, etc..) if the URL is on the same origin as the calling script.
    // - include: Always send user credentials (cookies, basic http auth, etc..), even for cross-origin calls.
    // See also: https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
    credentials: trustNetwork ? "include" : "same-origin"
  }

  const httpLink = createHttpLink(finalLinkOptions)

  const middlewareLink = setContext(() => ({
    headers: {
      authorization: getAuthHeader ? getAuthHeader() : null
    }
  }))

  // use with apollo-client
  const link = middlewareLink.concat(httpLink)
  const cache = new InMemoryCache()

  return new ApolloClient({
    link,
    cache,
    ...clientOptions
  })
}
