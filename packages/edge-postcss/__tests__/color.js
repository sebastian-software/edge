import { compile } from "./core"

// ====================================================
// ================== COLOR ===========================
// ====================================================

test("Improved Color Palette", () =>
  compile(".red { color: red; }")
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

test("Easing Gradients", () =>
  compile(`
.demo {
  background: scrim-gradient(
    black,
    transparent
  );
}`))
