import reactTreeWalker from "react-tree-walker"

/* eslint-disable no-shadow */
/* eslint-disable max-params */
export default function deepFetch(rootElement) {
  function visitor(element, instance, context) {
    if (instance && typeof instance.fetchData === "function") {
      const value = instance.fetchData();
      if (value instanceof Promise) {
        return value.catch((err) => {
          console.log("[EDGE] Fetch failed: " + err);
        })
      }
    }

    return true
  }

  return reactTreeWalker(rootElement, visitor)
}
