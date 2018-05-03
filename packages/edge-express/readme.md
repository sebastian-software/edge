# Edge Express<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/edge-express
[deps-img]: https://david-dm.org/sebastian-software/edge-express.svg
[npm]: https://www.npmjs.com/package/edge-express
[npm-downloads-img]: https://img.shields.io/npm/dm/edge-express.svg
[npm-version-img]: https://img.shields.io/npm/v/edge-express.svg
[travis-img]: https://img.shields.io/travis/sebastian-software/edge-express/master.svg?branch=master&label=unix%20build
[appveyor-img]: https://img.shields.io/appveyor/ci/swernerx/edge-express/master.svg?label=windows%20build
[travis]: https://travis-ci.org/sebastian-software/edge-express
[appveyor]: https://ci.appveyor.com/project/swernerx/edge-express/branch/master

Edge Express is a centralized Express-based HTTP server with sophisticated built-in security. Part of the Edge Platform.

> The Edge Platform helps you focus on business logic rather than dealing with massive tooling, common patterns, complex configurations.

## Features

- Express Security with Helmet and HPP.
- Improved Express Error Handling.
- Custom "setup" and "dynamic" middleware as needed.
- Support for Body-Parser, JSON, Cookies and Static serving out-of-the-box.
- Bundled for Node6 + Node8 (Different Library Outputs).


## Public API

- `addCoreMiddleware()`
- `addErrorMiddleware()`
- `addFallbackHandler()`
- `addSecurityMiddleware()`
- `createExpressServer()`



## License

[Apache License Version 2.0, January 2004](license)


## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017-2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
