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

function compile(input) {
  return postcss(plugins)
    .process(input, options)
    .then((result) => expect(result.css).toMatchSnapshot())
}

test("Lost Grid", () =>
  compile(".grid { lost-column: 3/12 }")
)

test("Autoprefixer", () =>
  compile(":fullscreen a { display: flex }")
)

test("Mixins", () =>
  compile("@mixin simple{ color: red; } h1 { @include simple; }")
)

test("Variables", () =>
  compile("$bgColor: red; h1 { background: $bgColor; }")
)

test("Nested", () =>
  compile("body { h1 { font-weight: bold; } h2 { font-weight: normal; }}")
)

test("Nested Parent Selector", () =>
  compile("body { ul { li { &:first-child { margin-top: 0; }}}}")
)

test("Grid KISS", () =>
  compile(`
    body {
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

test("Calc Trivial", () =>
  compile(".elem { width: calc(300px + 10px); }")
)

test("Calc Variable", () =>
  compile("$margin: 10px; .elem { width: calc(200px + $margin); }")
)

test("Calc Keep", () =>
  compile(".elem { width: calc(100px + 2%); }")
)

test("zIndex", () =>
  compile(".first { z-index: 1000; } .second { z-index: 2000; }")
)
