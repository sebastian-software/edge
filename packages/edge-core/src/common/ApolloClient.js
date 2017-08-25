import { ApolloClient, createNetworkInterface, createBatchingNetworkInterface } from "react-apollo"

export function createApolloClient(config = {}) {
  const {
    headers,
    uri = null,
    batchRequests = false,
    trustNetwork = true,
    queryDeduplication = true
  } = config

  const hasApollo = uri != null
  const ssrMode = process.env.TARGET === "node"
  var client

  if (hasApollo) {
    var opts = {
      credentials: trustNetwork ? "include" : "same-origin",

      // transfer request headers to networkInterface so that they're accessible to proxy server
      // Addresses this issue: https://github.com/matthew-andrews/isomorphic-fetch/issues/83
      headers
    }

    var networkInterface

    if (batchRequests) {
      networkInterface = createBatchingNetworkInterface({
        uri,
        batchInterval: 10,
        opts
      })
    } else {
      networkInterface = createNetworkInterface({
        uri,
        opts
      })
    }

    client = new ApolloClient({
      ssrMode,
      queryDeduplication,
      networkInterface
    })
  } else {
    client = new ApolloClient({
      ssrMode,
      queryDeduplication
    })
  }

  return client
}
