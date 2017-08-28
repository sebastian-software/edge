import deepFetch from "./deepFetch"

export default async function fetchData(WrappedApplication, kernel) {
  // Asynchronous magic... loading required application data
  // Supports parallel loading of either Apollo-style (aka fetchData())
  // and Redux-First-Router aka thunks attached to paths
  const start = new Date()
  console.log("[EDGE] Fetching data...")
  const result = await Promise.all([
    kernel.router.thunk(kernel.store),
    deepFetch(WrappedApplication)
  ])

  console.log(`[EDGE] Done in ${new Date() - start}ms`)
  return result
}
