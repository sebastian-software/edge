import postcss from "postcss"
import loadConfig from "postcss-load-config"

let plugins = null
let options = null

beforeAll(() =>
  loadConfig({ map: false }).then((config) => {
    plugins = config.plugins
    options = config.options
    return true
  })
)

// We add some super basic formatting to our CSS to make snapshots better readable
// and inspectable in case of any regressions later on.
function format(cssString) {
  return cssString
    .replace(/;/g, ";\n")
    .replace(/}/g, "\n}\n\n")
    .replace(/{/g, "{\n")
    .replace(/}\n\n\n}/g, "}\n}\n\n")
    .replace(/\n\n\n\n/g, "\n\n")
    .trim()
}

export function compile(input) {
  let allOptions = {
    ...options,
    from: "__tests__/main.css",
    to: "__tests__/dist/main.css"
  }

  return postcss(plugins)
    .process(input, allOptions)
    .then((result) => expect(format(result.css)).toMatchSnapshot())
}

export function compileSameFolder(input) {
  let allOptions = {
    ...options,
    from: "__tests__/fixtures/main.css",
    to: "__tests__/fixtures/main.out.css"
  }

  return postcss(plugins)
    .process(input, allOptions)
    .then((result) => expect(format(result.css)).toMatchSnapshot())
}
