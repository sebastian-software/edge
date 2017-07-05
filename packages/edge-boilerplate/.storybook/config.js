import { configure, setAddon } from "@storybook/react"

function loadStories() {
  require("../src/Stories")
  // You can require as many stories as you need.
}

configure(loadStories, module)
