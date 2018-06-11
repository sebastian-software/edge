import config from "./index"
import webpack from "webpack"

test("Webpack parses config", () => {
  const compiler = webpack(config)
  expect(compiler).toBeDefined()
})
