import { compile } from "./core"

// ====================================================
// ================ SASS INSPIRED =====================
// ====================================================

test("Config Maps", () =>
  compile("h1 { background: map(Config, bgcolor); }")
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
