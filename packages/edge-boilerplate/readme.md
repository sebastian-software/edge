# Edge Boilerplate<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/Nehv39FW5U4NHEn7axuGx4CE/sebastian-software/edge-boilerplate'>  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/Nehv39FW5U4NHEn7axuGx4CE/sebastian-software/edge-boilerplate.svg' /></a>

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

- Server Side React Rendering for excellent SEO Support and very high Mobile Performance.
- Semi-Automatic Code-Splitting for both CSS and JS.
- Hot Loading for Client and Server using Webpack Multi Compiler Architecture.
- PostCSS powered CSS pipeline with Sass-inspired features.
- CSS Modules for Component Style Isolation.
- Build Caching using Webpacks Cache-Loader.
- Efficient Long-Term-Caching using Hashed File Names.
- React Helmet for Efficient Header Element Handling
- Redux Infrastructure Built-In


## Usage

### Prerequisites

- `npm install`

### Create .env file

Copy the file .env-dev to .env before running any npm scripts.

### Production Build

Bundles and executes a server side React server. Initial rendering is taken place on the server for
optimal client side performance. The server also figures out the initial styles and scripts required for
rendering and allows the client to stream all these resources in parallel to other tasks.

- `run prod:start`

### Development Mode

Hot reloading server for client and server side React code. Offers very fast-paced development cycles
as everything is rebuild as needed and in most cases hot-injected into the running application.

- `run start`


## Code Style

This package uses [readable-code](https://github.com/sebastian-software/readable-code) for keeping
a unified code style with other projects.


## Storybook

The UI components can be viewed with the included storybook: Run `npm run storybook` and visit [http://localhost:1449](http://localhost:1449)


## Styleguidist

The UI components can be viewed with the included styleguidist: Run `npm run styleguide` and visit [http://localhost:1559](http://localhost:1559)



## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://raw.githubusercontent.com/sebastian-software/readable-code/master/assets/sebastiansoftware.png" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
