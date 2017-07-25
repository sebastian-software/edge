import { compile } from "./core"

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

