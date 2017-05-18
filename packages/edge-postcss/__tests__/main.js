import postcss from "postcss"
import loadConfig from "postcss-load-config"

function css(input) {
  return loadConfig({ map: false }).then(({ plugins, options }) => {
    return postcss(plugins)
      .process(input, options)
      .then((result) => expect(result.css).toMatchSnapshot())
  })
}

test("Lost Grid", () =>
  css(".grid { lost-column: 3/12 }")
)

test("Autoprefixer", () =>
  css(":fullscreen a { display: flex }")
)

test("Mixins", () =>
  css("@mixin simple{ color: red; } h1 { @include simple; }")
)

test("Variables", () =>
  css("$bgColor: red; h1 { background: $bgColor; }")
)

test("Nested", () =>
  css("body { h1 { font-weight: bold; } h2 { font-weight: normal; }}")
)

test("Nested Parent Selector", () =>
  css("body { ul { li { &:first-child { margin-top: 0; }}}}")
)

test("Grid KISS", () =>
  css(`
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
  css(".elem { width: calc(300px + 10px); }")
)

test("Calc Variable", () =>
  css("$margin: 10px; .elem { width: calc(200px + $margin); }")
)

test("Calc Keep", () =>
  css(".elem { width: calc(100px + 2%); }")
)

test("zIndex", () =>
  css(".first { z-index: 1000; } .second { z-index: 2000; }")
)
