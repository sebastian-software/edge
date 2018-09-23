# Jest Preset Edge - Advanced Frontend Focussed Jest Configuration

## Features

- Supports CSS Modules using `identity-obj-proxy`.
- Mocks all asset file requirements for e.g. images, fonts, graphql files, ...
- Includes a mock for the native `fetch()` method.
- Polyfills `requestAnimationFrame()` which is required by React v16.
- Configures Date constructors to return a static data which is very helpful for snapshot testing.
- Integrates a mock for HTML5 canvas so that API calls does not throw inside NodeJS (via JSDOM).

## Excludes for Coverage

- Excludes typical *Edge Platform* based application glue code files e.g. `Application.js`, `State.js` and `Init.js`.
- Excludes *Webpack* and generic bundling/package entry points.
- Excludes *Storybook* stories following the `.story.js` naming convention.
- Excludes *Jest* tests following the `.test.js` naming convention or being placed inside a `__tests__` folder.

## Usage

Install via NPM:

```
npm install --save-dev jest-preset-edge
```

Define the preset inside your own configuration. [Official docs](https://facebook.github.io/jest/docs/en/configuration.html#preset-string):

```js
module.exports = {
  "preset": "jest-preset-edge"
}
```

This works in a `jest.config.js` or in the `package.json` file under the `jest` key.



## License

[Apache License Version 2.0, January 2004](license)


## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/0d4ec9d6/sebastiansoftware-en.svg" alt="Logo of Sebastian Software GmbH, Mainz, Germany" width="460" height="160"/>

Copyright 2017-2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
