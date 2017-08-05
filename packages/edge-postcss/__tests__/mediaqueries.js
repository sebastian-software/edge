import { compile } from "./core"

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
