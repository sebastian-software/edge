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

function compile(input) {
  let allOptions = { ...options, from: "__tests__/main.css", to: "__tests__/dist/main.css" }

  return postcss(plugins)
    .process(input, allOptions)
    .then((result) => expect(format(result.css)).toMatchSnapshot())
}

test("Smart Import Basic", () =>
  compile("@import './fixtures/import-a.css';")
)

test("Smart Import with Merge", () =>
  compile("@import './fixtures/import-b.css'; .section { background: #333; }")
)

test("Simple URL", () =>
  compile(".icon { background: url('./fixtures/formula.png'); }")
)

test("Asset Size", () =>
  compile(".icon { background-size: width('./fixtures/formula.png') height('./fixtures/formula.png'); }")
)

test("Responsive Type", () =>
  compile("html { font-size: responsive 12px 21px; font-range: 420px 1280px; }")
)

test("Sassy Mixins", () =>
  compile("@mixin simple{ color: red; } h1 { @include simple; }")
)

test("Sassy Variables", () =>
  compile("$bgColor: red; h1 { background: $bgColor; }")
)

test("Nested Basic", () =>
  compile("body { h1 { font-weight: bold; } h2 { font-weight: normal; }}")
)

test("Nested Parent Selector", () =>
  compile("body { ul { li { &:first-child { margin-top: 0; }}}}")
)

test("Lost Grid", () =>
  compile(".grid { lost-column: 3/12 }")
)

test("Grid KISS", () =>
  compile(`
    .gridTest {
    	grid-kiss:
    		"+-------------------------------+      "
    		"|           header ↑            | 120px"
    		"+-------------------------------+      "
    		"                                       "
    		"+-- 30% ---+  +--- auto --------+      "
    		"| .sidebar |  |       main      | auto "
    		"+----------+  +-----------------+      "
    		"                                       "
    		"+-------------------------------+      "
    		"|              ↓                | 60px "
    		"|         → footer ←          |      "
    		"+-------------------------------+      "
    }
  `)
)

test("Magic Animations", () =>
  compile(".animation { animation-name: magic; }")
)

test("Will Change Compat", () =>
  compile(".scaled { will-change: width; }")
)

test("Calc Trivial", () =>
  compile(".elem { width: calc(300px + 10px); }")
)

test("Calc Variable", () =>
  compile("$margin: 10px; .elem { width: calc(200px + $margin); }")
)

test("Calc Keep", () =>
  compile(".elem { width: calc(100px + 2%); }")
)

test("Easings", () =>
  compile(".snake { transition: all 600ms ease-in-sine; }")
)

test("RGBA with Hex", () =>
  compile(".red { color: rgba(#f11, 0.8); }")
)

test("Hex with Alpha", () =>
  compile(".blue { color: #11fc; }")
)

test("Color Function", () =>
  compile(".yellow { color: color(yellow a(90%)) }")
)

// TODO

test("zIndex", () =>
  compile(".first { z-index: 1000; } .second { z-index: 2000; }")
)

test("CSS-O (Optimizer)", () =>
  compile(".elem { color: #ff0000; }")
)

test("Autoprefixer", () =>
  compile(":fullscreen a { display: flex }")
)
