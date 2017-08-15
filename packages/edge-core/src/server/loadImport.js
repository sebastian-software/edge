/* global __webpack_require__ */
import { CHUNK_NAMES } from "react-universal-component"

/**
 * Acts on transpiled `import()` statements from
 * [babel-plugin-universal-import](https://www.npmjs.com/package/babel-plugin-universal-import).
 *
 * @param {Object} wrapped The return value from transpiled `import()` statements.
 * @param {boolean} load Whether to actual load the imported file, otherwise just tracks that it's being imported.
 * @returns {any} The default export of the imported file (synchronously loaded).
 */
export default function loadImport(wrapped, load = true) {
  CHUNK_NAMES.add(wrapped.chunkName())
  return load ? __webpack_require__(wrapped.resolve()).default : null
}
