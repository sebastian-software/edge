import initStoryshots from "@storybook/addon-storyshots"
import { dirname } from "path"

initStoryshots({
  configPath: dirname(require.resolve("edge-storybook"))
})
