/* global __webpack_require__ */
import { CHUNK_NAMES } from "react-universal-component"

export default function loadImport(wrapped) {
  CHUNK_NAMES.add(wrapped.chunkName())
  return __webpack_require__(wrapped.resolve()).default
}
