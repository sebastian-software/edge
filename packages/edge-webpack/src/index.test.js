import { core, full } from "./index"
import webpack from "webpack"

test("Webpack parses core config", () => {
  const compiler = webpack(core)
  expect(compiler).toBeDefined()
})

test("Webpack parses full config", () => {
  const compiler = webpack(full)
  expect(compiler).toBeDefined()
})
