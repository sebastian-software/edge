# Edge Style <br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/edge-style
[deps-img]: https://david-dm.org/sebastian-software/edge-style.svg
[npm]: https://www.npmjs.com/package/edge-style
[npm-downloads-img]: https://img.shields.io/npm/dm/edge-style.svg
[npm-version-img]: https://img.shields.io/npm/v/edge-style.svg
[travis-img]: https://img.shields.io/travis/sebastian-software/edge-style/master.svg?branch=master&label=unix%20build
[appveyor-img]: https://img.shields.io/appveyor/ci/swernerx/edge-style/master.svg?label=windows%20build
[travis]: https://travis-ci.org/sebastian-software/edge-style
[appveyor]: https://ci.appveyor.com/project/swernerx/edge-style/branch/master

> The Edge Platform helps you focus on business logic rather than dealing with massive tooling, common patterns, complex configurations.

We know the hassle of adding basic sensible styling to your Single Page Application.
Interestingly there were a lot of seperate libraries and solutions but not a useful combination of all of it.
Edge Style is our take on delivering same basic styling for SPAs.

## Features

- **Normalize**: Based on normalize.css but using the application's customized browerslist: Why add the full normalize if you can only use what's needed?
- **Reset**: Reset of all margins and paddings on block level elements: Layouting is easier when having a blank slate.
- **Sanitize**: Sanitizes typical gotchas and non ideal legacy standards.
- **Box Sizing**: Configures all elements and their shadow elements to use `border-box`.
- **Aria**: Implements some best practises on ARIA markup.
- **OpenType**: Tweaks default behavior of all native elements to use advanced OpenType features where useful.
- **Intl**: Localized configuration for HTML quotes.

## Installation

```
npm install --save-dev edge-style
```

Edge Style requires a PostCSS-based setup where [postcss-normalize](https://github.com/jonathantneal/postcss-normalize) is enabled in the PostCSS configuration.

Other than that Edge Style works effectively without any further plugins as there is e.g. no selector nesting being used inside the source files. It couldn't hurt to add [autoprefixer](https://github.com/postcss/autoprefixer) though for managing the minimum amount of prefixes required by your [browserslist](http://browserl.ist/).

## Usage

Anywhere in your application code just import the full package. Ideally it should be the first thing to include on the client side. There is no need for integrating it on the server side code (SSR).

```js
import "edge-style"
```

## Related

- [Edge PostCSS](https://github.com/sebastian-software/edge-postcss) is our very own PostCSS plugin configuration which comes with autoprefixer and postcss-normalize built-in.



## License

[Apache License Version 2.0, January 2004](license)


## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017-2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
