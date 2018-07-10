import { dirname } from "path"
import initStoryshots from "@storybook/addon-storyshots"

initStoryshots({
  configPath: dirname(require.resolve("edge-storybook"))
})
