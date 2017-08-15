/**
 * Acts on transpiled `import()` statements from
 * [babel-plugin-universal-import](https://www.npmjs.com/package/babel-plugin-universal-import).
 *
 * @param {Object} wrapped The return value from transpiled `import()` statements.
 * @param {boolean} load Whether to actual load the imported file, otherwise just tracks that it's being imported.
 * @returns {Promise} Promise which resolves with the default import of imported file (asynchronous, lazy loaded).
 */
export default function loadImport(wrapped, load = true) {
  if (load) {
    return wrapped.then((module) => {
      return module && module.__esModule ? module.default : module
    })
  } else {
    return Promise.resolve(null)
  }
}
