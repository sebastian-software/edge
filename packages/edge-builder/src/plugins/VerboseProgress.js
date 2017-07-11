/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/* eslint-disable no-magic-numbers */

import ora from "ora"

export default class VerboseProgress {
  apply(compiler) {
    let lastModulesCount = 0
    let moduleCount = 500
    let doneModules = 0
    let spinner = null
    var prevPercent = 0
    const activeModules = []

    function handler(percentage, message) {
      if (percentage < 1) {
        spinner.text = `${Math.floor(percentage * 100)}% ${message}`

        // We somehow have to force rendering otherwise busy Webpack wouldn't let us.
        if (percentage !== prevPercent) {
          spinner.render()
          prevPercent = percentage
        }
      } else {
        spinner.succeed("Done!")
      }
    }

    function update(module) {
      handler(
        0.1 + doneModules / Math.max(lastModulesCount, moduleCount) * 0.6,
        `building modules ${doneModules}/${moduleCount}`
      )
    }

    function moduleDone(module) {
      doneModules++
      const ident = module.identifier()
      if (ident) {
        const idx = activeModules.indexOf(ident)
        if (idx >= 0) activeModules.splice(idx, 1)
      }
      update()
    }

    compiler.plugin("compilation", (compilation) => {
      if (compilation.compiler.isChild()) return
      lastModulesCount = moduleCount
      moduleCount = 0
      doneModules = 0

      spinner = ora({ interval: 16 })
      spinner.start()

      handler(0, "compiling")

      compilation.plugin("build-module", (module) => {
        moduleCount++
        const ident = module.identifier()
        if (ident) {
          activeModules.push(ident)
        }
        update()
      })

      compilation.plugin("failed-module", moduleDone)
      compilation.plugin("succeed-module", moduleDone)

      const syncHooks = {
        "seal": [ 0.71, "sealing" ],
        "optimize": [ 0.72, "optimizing" ],
        "optimize-modules-basic": [ 0.73, "basic module optimization" ],
        "optimize-modules": [ 0.74, "module optimization" ],
        "optimize-modules-advanced": [ 0.75, "advanced module optimization" ],
        "optimize-chunks-basic": [ 0.76, "basic chunk optimization" ],
        "optimize-chunks": [ 0.77, "chunk optimization" ],
        "optimize-chunks-advanced": [ 0.78, "advanced chunk optimization" ],
        "optimize-chunk-modules": [ 0.8, "chunk modules optimization" ],
        "optimize-chunk-modules-advanced": [ 0.81, "advanced chunk modules optimization" ],
        "revive-modules": [ 0.82, "module reviving" ],
        "optimize-module-order": [ 0.83, "module order optimization" ],
        "optimize-module-ids": [ 0.84, "module id optimization" ],
        "revive-chunks": [ 0.85, "chunk reviving" ],
        "optimize-chunk-order": [ 0.86, "chunk order optimization" ],
        "optimize-chunk-ids": [ 0.87, "chunk id optimization" ],
        "before-hash": [ 0.88, "hashing" ],
        "before-module-assets": [ 0.89, "module assets processing" ],
        "before-chunk-assets": [ 0.9, "chunk assets processing" ],
        "additional-chunk-assets": [ 0.91, "additional chunk assets processing" ],
        "record": [ 0.92, "recording" ]
      }

      Object.keys(syncHooks).forEach((name) => {
        let pass = 0
        const settings = syncHooks[name]
        compilation.plugin(name, () => {
          if (pass++ > 0) handler(settings[0], settings[1], `pass ${pass}`)
          else handler(settings[0], settings[1])
        })
      })

      compilation.plugin("optimize-tree", (chunks, modules, callback) => {
        handler(0.79, "module and chunk tree optimization")
        callback()
      })

      compilation.plugin("additional-assets", (callback) => {
        handler(0.91, "additional asset processing")
        callback()
      })

      compilation.plugin("optimize-chunk-assets", (chunks, callback) => {
        handler(0.92, "chunk asset optimization")
        callback()
      })

      compilation.plugin("optimize-assets", (assets, callback) => {
        handler(0.94, "asset optimization")
        callback()
      })
    })

    compiler.plugin("emit", (compilation, callback) => {
      handler(0.95, "emitting")
      callback()
    })

    compiler.plugin("done", () => {
      handler(1, "")
    })
  }
}
