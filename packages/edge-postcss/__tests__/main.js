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


// ====================================================
// ================== MERGING =========================
// ====================================================

test("Smart Import Basic", () =>
  compile("@import './fixtures/import-a.css';")
)

test("Smart Import with Merge", () =>
  compile("@import './fixtures/import-b.css'; .section { background: #333; }")
)



// ====================================================
// ================= URLS/ASSETS ======================
// ====================================================

test("Simple URL", () =>
  compile(".icon { background: url('./fixtures/formula.png'); }")
)

test("Asset Size", () =>
  compile(".icon { background-size: width('./fixtures/formula.png') height('./fixtures/formula.png'); }")
)



// ====================================================
// ================ SASS INSPIRED =====================
// ====================================================

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



// ====================================================
// ================== LAYOUT ==========================
// ====================================================

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



// ====================================================
// ================== COLOR ===========================
// ====================================================

test("RGBA with Hex", () =>
  compile(".red { color: rgba(#f11, 0.8); }")
)

test("Hex with Alpha", () =>
  compile(".blue { color: #11fc; }")
)

test("Color Function", () =>
  compile(".yellow { color: color(yellow a(90%)) }")
)




// ====================================================
// =============== MEDIA QUERIES ======================
// ====================================================

test("Media Query Min/Max", () =>
  compile("@media screen and (width >= 500px) and (width <= 1200px) { .elem { display: block; } }")
)

test("Custom Media", () =>
  compile(`
    @custom-media --small-viewport (max-width: 30em);
    @media (--small-viewport) {
      body { font-size: 12px; }
    }
  `)
)



// ====================================================
// ================== EFFECTS =========================
// ====================================================

test("Magic Animations", () =>
  compile(".animation { animation-name: magic; }")
)

test("Will Change Compat", () =>
  compile(".scaled { will-change: width; }")
)

test("Easings", () =>
  compile(".snake { transition: all 600ms ease-in-sine; }")
)

test("Pleeease Filters", () =>
  compile(".box { filter: drop-shadow(16px 16px 20px blue); }")
)

test("Transform Shortcut", () =>
  compile(".transform { scale: 2; translate: 10px 20px; }")
)



// ====================================================
// ================= EXTENSIONS =======================
// ====================================================

test("Responsive Type", () =>
  compile("html { font-size: responsive 12px 21px; font-range: 420px 1280px; }")
)

test("Clearfix", () =>
  compile(".row { clear: fix; }")
)

test("System UI", () =>
  compile("body { font-family: system-ui; }")
)



// ====================================================
// ================== FIXES ===========================
// ====================================================

test("Gradient Fix", () =>
  compile(".elem { background-image: linear-gradient(green, transparent); }")
)

test("Flexbox Fix", () =>
  compile(".elem { flex: 1; }")
)

test("Input Style Fixes", () =>
  compile(`
    input[type="range"]::track {
      height: 3px;
    }

    input[type="range"]::thumb {
      width: 16px;
      height: 8px;
    }
  `)
)

test("Autoprefixer", () =>
  compile(":fullscreen a { display: flex }")
)

test("Pseudoelements", () =>
  compile("a::before { color: red; }")
)

test("Selector matches()", () =>
  compile("p:matches(:first-child, .special) { color: red; }")
)



// ====================================================
// ================ OPTIMIZATION ======================
// ====================================================

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

test("CSS-O (Optimizer)", () =>
  compile(".elem { color: #ff0000; }")
)
