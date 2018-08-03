import { createReduxStore, createRootReducer } from "./State"

test("Create Redux Store - Basic", () => {
  const reducers = {}
  const middlewares = []
  const enhancers = []

  expect(createReduxStore({ reducers, middlewares, enhancers })).toBeDefined()
})

test("Create Redux Store - No Reducers", () => {
  const middlewares = []
  const enhancers = []

  expect(createReduxStore({ middlewares, enhancers })).toBeDefined()
})

test("Create Redux Store - Empty Param", () => {
  expect(createReduxStore({})).toBeDefined()
})

test("Create Redux Store - No Params", () => {
  expect(createReduxStore()).toBeDefined()
})

test("Create Root Reducer", () => {
  expect(createRootReducer()).toBeDefined()
})

test("Create Root Reducer with one reducer", () => {
  function dummy(prevState) {
    return prevState
  }

  expect(createRootReducer({ dummy })).toBeDefined()
})
