export default function loadImport(wrapped) {
  return wrapped.then((module) => module.default)
}
