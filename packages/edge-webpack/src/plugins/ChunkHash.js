/* eslint-disable func-names */
import { getHashDigest } from "loader-utils"
import crypto from "crypto"

export default function ChunkHash(options= {}) {
  this.algorithm = options.algorithm || "md5"
  this.digest = options.digest || "hex"
  this.additionalHashContent =
    options.additionalHashContent ||
    function() {
      return ""
    }
}

ChunkHash.prototype.apply = function(compiler) {
  const _plugin = this

  let compilerPlugin
  let compilationPlugin
  if (compiler.hooks) {
    compilerPlugin = function(fn) {
      compiler.hooks.compilation.tap("ChunkHash", fn)
    }
    compilationPlugin = function(compilation, fn) {
      compilation.hooks.chunkHash.tap("ChunkHash", fn)
    }
  } else {
    compilerPlugin = function(fn) {
      compiler.plugin("compilation", fn)
    }
    compilationPlugin = function(compilation, fn) {
      compilation.plugin("chunk-hash", fn)
    }
  }

  compilerPlugin((compilation) => {
    compilationPlugin(compilation, (chunk, chunkHash) => {
      let modules
      if (chunk.modulesIterable) {
        modules = Array.from(chunk.modulesIterable, getModuleSource)
      } else if (chunk.mapModules) {
        modules = chunk.mapModules(getModuleSource)
      } else {
        modules = chunk.modules.map(getModuleSource)
      }
      const source = modules.sort(sortById).reduce(concatenateSource, "")


      const hash = crypto
        .createHash(_plugin.algorithm)
        .update(source + _plugin.additionalHashContent(chunk))

      chunkHash.digest = function(digest) {
        return hash.digest(digest || _plugin.digest)
      }
    })
  })
}

// helpers

function sortById(a, b) {
  return a.id - b.id
}

function getModuleSource(module) {
  return {
    id: module.id,
    source: (module._source || {})._value || "",
    dependencies: (module.dependencies || []).map((d) => {
      return d.module ? d.module.id : ""
    })
  }
}

function concatenateSource(result, module) {
  return (
    `${result
    }#${
      module.id
    }:${
      module.source
    }$${
      module.dependencies.join(",")}`
  )
}



const hashType = "sha256"
const digestType = "base62"
const digestLength = 8

function hashOld(chunk, chunkHash) {
  const generatedHash = getHashDigest(
    source,
    hashType,
    digestType,
    digestLength
  )
}
