import { ApolloClient } from "apollo-client"
import { createHttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"

export function createApolloClient(config = {}) {
  const { uri = null, trustNetwork = true, clientOptions = {}, linkOptions = {} } = config

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

  return new ApolloClient({
    link: createHttpLink(finalLinkOptions),
    cache: new InMemoryCache(),
    ...clientOptions
  })
}
