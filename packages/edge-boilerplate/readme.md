# Edge Boilerplate<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/edge-boilerplate
[deps-img]: https://david-dm.org/sebastian-software/edge-boilerplate.svg
[npm]: https://www.npmjs.com/package/edge-boilerplate
[npm-downloads-img]: https://img.shields.io/npm/dm/edge-boilerplate.svg
[npm-version-img]: https://img.shields.io/npm/v/edge-boilerplate.svg
[travis-img]: https://img.shields.io/travis/sebastian-software/edge-boilerplate/master.svg?branch=master&label=unix%20build
[appveyor-img]: https://img.shields.io/appveyor/ci/swernerx/edge-boilerplate/master.svg?label=windows%20build
[travis]: https://travis-ci.org/sebastian-software/edge-boilerplate
[appveyor]: https://ci.appveyor.com/project/swernerx/edge-boilerplate/branch/master

Edge Boilerplate is a template for modern web applications. Part of the Edge Platform.

## Demo

- [Latest](https://edge-boilerplate-latest.now.sh/) (Hosted by [now](https://now.sh/))






## Features

- Hot Loading for both Client + Server
- Bundled Client + Server
- Lightweight production build
- Long Term Caching using Hashed Assets
- Server Side React Rendering for excellent SEO Support and very high Mobile Performance.
- Semi-Automatic Code-Splitting for both CSS and JS.
- Hot Loading for Client and Server using Webpack Multi Compiler Architecture.
- PostCSS powered CSS pipeline with Sass-inspired features.
- CSS Modules for Component Style Isolation.
- Build Caching using Webpacks Cache-Loader.
- Efficient Long-Term-Caching using Hashed File Names.
- React Helmet for Efficient Header Element Handling
- Redux Infrastructure Built-In



## Getting Started

### Prerequisites

- Execute `npm install` or `yarn install`

### Create .env file

Copy the file `.env-dev` to `.env` before running any `npm` scripts.

### Start development server

Execute: `npm run dev`

To exit the development server press `Ctrl+C`.

This is the ideal for fast-paced development cycles
as everything is rebuild as needed and in most cases hot-injected into the running application.

### Run Storybook

The UI components can be viewed with the included *Storybook*: Run `npm run storybook` and visit `http://localhost:1449`.


### Run Styleguidist

The UI components can be viewed with the included *Styleguidist*: Run `npm run styleguide` and visit `http://localhost:1559`.

### Bundling for production

In any phase of your development you can bundle the files for a deployment to production. This essentially contains these steps:

1. Bundling the client side application
2. Bundling the server side application code with knowledge of the asset file names of the client.
3. Bundling the *binary* server which contains the overall express server.

### Deploy to production

TODO



## Application Structure

### Version Managed Files/Folders

- `hooks/`: Extensions for some more internal features like the *Webpack*-based build system.
- `src/`: This holds all application code.

### Generated Files/Folders

- `bin/`: Contains the binary web server
- `build/`: Generated during development and production build. Contains the bundled application files for both, server and client.
- `docs/`: Generated documentation e.g. Storybook production build for deployment to e.g. Github Pages.
- `node_modules/`: Contains all local NPM package dependencies.
- `.cache/`: Contains the entries of the *Webpack* loader cache to improve rebuild times.


## Customizing using Standard Configuration Files

### PostCSS

The project folder contains the file `postcss.config.js`. This includes only `edge-postcss` in the as-delivered state. Any extensions are possible. Of course, the standard set of `edge-postcss` can also be completely replaced here, for example with `postcss-next`.

### Babel

The `. babelrc` file to be found in the project folder is a normally customizable Babel configuration. The pre-configured Babel environments starting with `edge-` are relevant for the build processes through Edge. On delivery state, the preset package `babel-preset-edge` is configured in different ways. All entries can be changed and extended at will. Of course, one should be careful here, because the current *Webpack*-based build process expects some special features, such as support for dynamic imports. As a rule, however, extensions should not be a problem, e.g. to add functionalities such as decorators.

### Browser

The *Edge Platform* uses *Browserslist* to optimize builds for the configured set of browsers. The default configuration differs between `development` and `production`. This is mainly done to optimize build times during development and thus allow faster development cycles.

More modern browsers usually offer better support for the latest standards. Edge uses this to send these browsers less sophisticated rewritten code. As a positive side-effect, this also leads to better error messages during development, because the code the browser sees is closer to the code originally developed.

The configuration affects both, the *Babel* transpiler and the `PostCSS` prefixing.

*Edge* provides some sensible defaults here. It is of course possible to customize the file `browserslist` however you like. It should not really have any effect on the core functionalities of the Edge platform.

### Jest

To configure the *Jest* test runner use the `jest.config.js`, which is located in the main directory like the other config files. In the state of delivery `edge-jest` will be imported and directly exported without any changes. Here it is possible to make adjustments in the form of overrides and additions to the imported config.

The standard configuration includes the following core features:

- Exclude entry code points (client, server, views) from the code coverage, just like all test and storybook files.
- Compatibility for assets that are supported by the build with *Webpack*.
- Support for CSS modules.
- Includes a Polyfill for Request Animation Frame for React v16 compatibility.
- Overrides or mocks the native Fetch API to prevent actual `fetch()` requests being made in tests.


## Customizing using Hooks

### Webpack

TODO

### Storybook

TODO





## License

[Apache License Version 2.0, January 2004](license)


## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017-2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
