import { compile } from "./core"

// ====================================================
// ================== FIXES ===========================
// ====================================================

test("Font Variant", () =>
  compile(`
h2 {
  font-variant-caps: small-caps;
}

table {
  font-variant-numeric: lining-nums;
}`))

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
