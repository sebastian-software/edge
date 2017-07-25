import { compile } from "./core"


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
