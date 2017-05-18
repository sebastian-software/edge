import postcss from "postcss"
import loadConfig from "postcss-load-config"

test("Render Lost Grid", () => {
  let css = "h1 { lost-column: 3/12 }"

  return loadConfig({ map: "inline" }).then(({ plugins, options }) => {
    return postcss(plugins)
      .process(css, options)
      .then((result) => expect(result.css).toMatchSnapshot())
  })
})
