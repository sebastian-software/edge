import { createReduxStore, createRootReducer } from "./State"
import { createReduxRouter } from "./ReduxRouter"

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

test("Create Redux Store - With Redux Router", () => {
  const router = createReduxRouter()
  expect(router).toBeDefined()
  expect(typeof router).toBe("object")

  const reducers = {}
  const middlewares = []
  const enhancers = []
  const store = createReduxStore({ reducers, middlewares, enhancers, router })
  expect(store).toBeDefined()
  expect(typeof store).toBe("object")
})
