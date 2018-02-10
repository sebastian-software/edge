# Edge Storybook Config

This project contains our configuration and the dependencies to simplify usage of Storybook inside applications and components.

## Features

- Babel Preset Edge is built-in so that you are able to use all typical ES features you know from any `edge-builder`-based project.
- Hot Loading to allow straight-forward development of components inside of Storybook.
- Integrated action logger for testing buttons and other interactive components.
- Responsive Panel with device selector for easily accessing common screen resolutions.
- Support for Storyshots to combine your stories with Jest's powerful snapshot testing.
- Webpack has support for CSS Modules and generic URL handling for all typical asset files.
- Wrapped with our typical Intl Provider (Localization) and State Provider (Redux).

## Installation / Config

Install the config using:

```
npm install --save-dev edge-storybook
```

Then add the following scripts to your `package.json`:

```json
"storybook": "start-storybook --port 1449 --config-dir node_modules/edge-storybook/lib",
"storybook:build": "build-storybook --output-dir docs/storybook --config-dir node_modules/edge-storybook/lib",
```

We currently default to port `1449` in all our Storybooks, but you can tweak the value as needed.

## Create Stories

Storybook is configured in a way that it automatically adds all stories which match the following pattern: `/\.story\.js$/` e.g. `Button.story.js`

Stories should be placed inside the component folder for each component and developed alongside e.g.:

```
src/components/button/Button.js
src/components/button/Button.css
src/components/button/Button.story.js
src/components/button/Button.test.js
```

## Start Storybook

To run Storybook run the command `npm run storybook`. When configured as listed above you should be able to see your Storybook at `localhost:1449` inside your preferred browser.

This is also the ideal environment for development of plain, application-unaware components. One major benefit here is that Storybook sandboxes each demonstrated component from the other available components.

## Deploy Demo Environment

After you have executed `npm run storybook:build` you got a new folder, typically `docs/storybook` which is ready to be published on any static HTML server like Nginx.

## Snapshot Testing

As we configured Storybook for being integrated with Jest's so-called snapshot testing it is pretty straightforward to use this inside your project. Typically you add the following file into your components folder under the name `Stories.test.js`:

```js
import initStoryshots from "@storybook/addon-storyshots"

initStoryshots({
  configPath: "./node_modules/edge-storybook/lib"
})
```

It makes sense to just use shallow snapshots. That's how Jest normally behaves as well with snapshot tests. You typically do not want to include the fully resolved DOM structure into all snapshots. Testing should end at the boundaries of your components.


## License

[Apache License Version 2.0, January 2004](license)


## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017-2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
