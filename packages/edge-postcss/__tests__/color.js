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

test("CSS4 HSL Colors", () =>
  compile(`
.hsl {
  color: hsl(0 100% 50%);
  border-color: hsl(200grad 100% 50% / 20%);
}`))

test("CSS4 HWB Colors", () =>
  compile(`
.hwb {
  color: hwb(90, 0%, 0%, 0.5);
}`))

