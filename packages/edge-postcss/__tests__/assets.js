import { compile, compileSameFolder } from "./core"

// ====================================================
// ================= URLS/ASSETS ======================
// ====================================================

test("Asset URL", () =>
  compile(".icon { background: url('./fixtures/formula.png'); }"))

test("Asset URL (Same Folder)", () =>
  compileSameFolder(".icon { background: url('./formula.png'); }"))

test("Asset Size", () =>
  compile(
    ".icon { background-size: width('./fixtures/formula.png') height('./fixtures/formula.png'); }"
  ))

test("Asset Size (Same Folder)", () =>
  compileSameFolder(
    ".icon { background-size: width('./formula.png') height('./formula.png'); }"
  ))

test("Import with Asset URL", () =>
  compile("@import './fixtures/import-c.css';"))

test("Import with SVG URL", () =>
  compile("@import './fixtures/other/Home.css';"))

test("Import with Webfonts", () =>
  compile("@import './fixtures/font/SourceSansPro.css';"))
