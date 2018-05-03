# Centralized Jest Configuration

## Features

- Supports CSS Modules using `identity-obj-proxy`.
- Mocks all asset file requirements for e.g. images, fonts, ...
- Includes a mock for the native `fetch()` method.
- Polyfills `requestAnimationFrame()` which is required by React v16.

## Excludes for Coverage

- Excludes typical *Edge Platform* based application glue code files e.g. `Application.js` and `State.js`.
- Excludes *Webpack* and *Prepublish* entry points.
- Excludes *Storybook* stories following the `.story.js` naming convention.
- Excludes *Jest* tests following the `.test.js` naming convention.

## Usage

Install via NPM:

```
npm install --save-dev edge-jest
```

Add your local Jest config as a `jest.config.js` file - Config inside your `package.json` is not supported!

```js
/* eslint-disable */
const config = require("edge-jest")

// Modify/Extend the config object here

module.exports = config
```

Jest is automatically looking up the configuration file. No need for passing any further information.



## License

[Apache License Version 2.0, January 2004](license)


## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017-2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
