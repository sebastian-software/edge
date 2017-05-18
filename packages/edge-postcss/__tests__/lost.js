import postcss from "postcss"
import loadConfig from "postcss-load-config"

test("Lost Grid", () => {
  let input = ".grid { lost-column: 3/12 }"

  return loadConfig({ map: "inline" }).then(({ plugins, options }) => {
    return postcss(plugins)
      .process(input, options)
      .then((result) => expect(result.css).toMatchSnapshot())
  })
})

test("Autoprefixer", () => {
  let input = ":fullscreen a { display: flex }"

  return loadConfig({ map: "inline" }).then(({ plugins, options }) => {
    return postcss(plugins)
      .process(input, options)
      .then((result) => expect(result.css).toMatchSnapshot())
  })
})
