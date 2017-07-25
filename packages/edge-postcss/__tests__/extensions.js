import { compile } from "./core"

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

test("Normalize.css", () =>
  compile(".before { color: red; } @import-normalize; .after { color: green; }")
)

test("Initial", () =>
  compile("h1 { font-family: initial; }")
)

test("Initial - All", () =>
  compile("ul { all: initial; }")
)
