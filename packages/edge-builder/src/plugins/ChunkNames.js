import path from "path"
import { getHashDigest } from "loader-utils"

const WORKING_DIR = process.cwd()
const HASH_TYPE = "sha256"
const DIGEST_TYPE = "base62"
const DIGEST_LENGTH = 4
const SCRIPT_EXTENSIONS = new Set([ ".mjs", ".js", ".jsx", ".ts", ".tsx" ])
const SKIP_FOLDERS = [ "lib", "dist", "src", "build" ]

function generateChunkName(request, rawRequest) {
  // Strip prefixed loader syntax from Webpack
  const splittedRequest = request.split("!")
  const cleanRequest = splittedRequest[splittedRequest.length - 1]

  // Getting relative path inside working directory
  let relative = path.relative(WORKING_DIR, cleanRequest)

  const isExternal = relative.startsWith(`node_modules${  path.sep}`)
  if (isExternal) {
    // if the module is an DelegatedModule, the rawRequest will be undefined since it does not have this property.
    // However, the userRequest property can supplement rawRequest in this situation
    relative = rawRequest || request
  }

  // Strip useless helper folder structure
  SKIP_FOLDERS.forEach((filter) => {
    relative = relative.replace(new RegExp("(^|/|\\\\)" + filter + "($|/|\\\\)"), (match, group1) => group1)
  })

  // Strip all script file extensions
  const fileExt = path.parse(relative).ext
  if (SCRIPT_EXTENSIONS.has(fileExt)) {
    relative = relative.replace(new RegExp(`${fileExt}$`), "")
  }

  let hash = getHashDigest(cleanRequest, HASH_TYPE, DIGEST_TYPE, DIGEST_LENGTH)
  let base = path.basename(relative)

  const result = `${base}-${hash}`

  return result
}

function getFirstModule(iterable) {
  for (const entry of iterable) {
    return entry
  }
}

export default class ChunkNames
{
  constructor({ debug = false }) {
    this.debug = debug
  }

  apply(compiler)
  {
    const debug = this.debug

    compiler.plugin("compilation", (compilation) => {
      compilation.plugin("optimize", () => {
        compilation.chunks.forEach((chunk) => {
          const firstModule = getFirstModule(chunk.modulesIterable)
          if (firstModule) {
            const userRequest = firstModule.userRequest
            const rawRequest = firstModule.rawRequest
            const oldName = chunk.name
            if (userRequest && oldName == null) {
              chunk.name = generateChunkName(userRequest, rawRequest)
              if (debug) {
                console.log("Assigned ChunkName:", chunk.name)
              }
            }
          }
        })
      })
    })
  }
}
