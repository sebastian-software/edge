import { compile } from "./core"

// ====================================================
// ================== MERGING =========================
// ====================================================

test("Import Basic", () =>
  compile("@import './fixtures/import-a.css';")
)

test("Import with Merge", () =>
  compile("@import './fixtures/import-b.css'; .section { background: #333; }")
)
