import { createApolloClient } from "./ApolloClient"

test("Create Apollo Client - No Data", () => {
  expect(createApolloClient()).toBeDefined()
})

test("Create Apollo Client - With Initial Data and URL", () => {
  expect(createApolloClient({ uri: "http://my.apollo.uri" })).toBeDefined()
})
