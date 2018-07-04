import initStoryshots, {
  multiSnapshotWithOptions
} from "@storybook/addon-storyshots"

initStoryshots({
  // Delegate to centralized config
  configPath: __dirname,

  // Storing seperate snapshots for each individual story
  test: multiSnapshotWithOptions({}),

  // Ignore all containers, only snapshot pure components
  // without any app logic or data fetching
  storyKindRegex: /^((?!container).)*$/i
})
