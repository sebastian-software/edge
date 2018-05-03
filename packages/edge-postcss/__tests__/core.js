import postcss from "postcss"
import loadConfig from "postcss-load-config"

let plugins = null
let options = null

beforeAll(async function() {
  const config = await loadConfig({ map: false })

  plugins = config.plugins
  options = config.options
})

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

export async function compile(input) {
  const allOptions = {
    ...options,
    from: "__tests__/main.css",
    to: "__tests__/dist/main.css"
  }

  const result = await postcss(plugins)
    .process(input, allOptions)

  expect(format(result.css)).toMatchSnapshot()
}

export async function compileSameFolder(input) {
  const allOptions = {
    ...options,
    from: "__tests__/fixtures/main.css",
    to: "__tests__/fixtures/main.out.css"
  }

  const result = await postcss(plugins)
    .process(input, allOptions)

  expect(format(result.css)).toMatchSnapshot()
}
