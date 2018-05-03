# Edge PostCSS<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/edge-postcss
[deps-img]: https://david-dm.org/sebastian-software/edge-postcss.svg
[npm]: https://www.npmjs.com/package/edge-postcss
[npm-downloads-img]: https://img.shields.io/npm/dm/edge-postcss.svg
[npm-version-img]: https://img.shields.io/npm/v/edge-postcss.svg
[travis-img]: https://img.shields.io/travis/sebastian-software/edge-postcss/master.svg?branch=master&label=unix%20build
[appveyor-img]: https://img.shields.io/appveyor/ci/swernerx/edge-postcss/master.svg?label=windows%20build
[travis]: https://travis-ci.org/sebastian-software/edge-postcss
[appveyor]: https://ci.appveyor.com/project/swernerx/edge-postcss/branch/master

Edge PostCSS is a collection of carefully chosen and configured PostCSS plugins. Part of the Edge Platform.

> The Edge Platform helps you focus on business logic rather than dealing with massive tooling, common patterns, complex configurations.

It combines some common learnings and conventions from Sass, with some upcoming CSS4 features and
adds a whole chain of fixes for a variety of browser bugs.

## Features

### MERGING

#### [import](https://github.com/postcss/postcss-import)

Smarter `@import()` plugin to include other CSS, Sass, SugarSS files.


### URLS/ASSETS

#### [smart-asset](https://github.com/sebastian-software/postcss-smart-asset)

Re-rebasing url()-referenced assets during processing.
Respects locations of imported files and PostCSS configured output location.

#### [assets](https://github.com/borodean/postcss-assets)

Asset Manager for PostCSS. For us mainly interesting
for its support for detecting image dimensions and
base64 based inlining.


### CLEANUP

#### [discard-comments](https://github.com/ben-eb/postcss-discard-comments)

Discard comments in your CSS files with PostCSS.
Remove all comments... we don't need them further down the line
which improves performance (reduces number of AST nodes)



### SASS INSPIRED

#### [sassy-mixins](https://github.com/andyjansson/postcss-sassy-mixins)

Sass-like mixins.

#### [advanced-variables](https://github.com/jonathantneal/postcss-advanced-variables)

Converts Sass-like variables and conditionals into CSS.

#### [nested](https://github.com/postcss/postcss-nested)

Unwrap nested rules like how Sass does it.



### NORMALIZE

#### [normalize](https://github.com/jonathantneal/postcss-normalize)

Add the useful [normalize rules](https://github.com/jonathantneal/normalize.css) to your CSS as needed by the local [browserslist](http://browserl.ist/) configuration.



### LAYOUT

#### [lost](https://github.com/peterramsing/lost)

Fractional grid system built with calc(). Supports masonry, vertical, and waffle grids.

#### [grid-kiss](https://github.com/sylvainpolletvillard/postcss-grid-kiss)

A PostCSS plugin to keep CSS grids stupidly simple



### COLOR

#### [hexrgba](https://github.com/seaneking/postcss-hexrgba)

Adds shorthand hex methods to rbga() values.

#### [color-hex-alpha](https://github.com/postcss/postcss-color-hex-alpha)

Transform RGBA hexadecimal notations (#RRGGBBAA or #RGBA) to more compatible CSS (rgba())

#### [color-function](https://github.com/postcss/postcss-color-function)

Transform W3C CSS color function to more compatible CSS



### MEDIA QUERIES

#### [media-minmax](https://github.com/postcss/postcss-media-minmax)

Writing simple and graceful Media Queries!
Support for [CSS Media Queries Level 4](https://drafts.csswg.org/mediaqueries/#mq-range-context).

#### [custom-media](https://github.com/postcss/postcss-custom-media)

Define custom Media Queries.



### EFFECTS

#### [magic-animations](https://github.com/nucliweb/postcss-magic-animations)

Adds `@keyframes` from Magic Animations

#### [will-change](https://github.com/postcss/postcss-will-change)

Insert 3D hack before will-change property

#### [easings](https://github.com/postcss/postcss-easings)

Replace easing names from http://easings.net to `cubic-bezier()`.

#### [pleeease-filters](https://github.com/iamvdo/pleeease-filters)

Fallback for Webkit Filters property to SVG filters. Amazing stuff.
It converts all 10 CSS shorthand filters: `grayscale`, `sepia`, `saturate`, `hue-rotate`, `invert`, `opacity`, `brightness`, `contrast`, `blur`, `drop-shadow`.

#### [transform-shortcut](https://github.com/jonathantneal/postcss-transform-shortcut)

Use shorthand transform properties in CSS.




### EXTENSIONS

#### [responsive-type](https://github.com/seaneking/postcss-responsive-type)

Automagical responsive typography. Adds a responsive property to `font-size`,
`line-height` and `letter-spacing` that generates complex calc and `vw` based font sizes.

#### [clearfix](https://github.com/seaneking/postcss-clearfix)

Adds fix and fix-legacy attributes to the clear property, for self-clearing of children.

#### [font-family-system-ui](https://github.com/JLHwung/postcss-font-family-system-ui)

Transform W3C CSS "font-family: system-ui" to a practical font-family list.
See also [this article by booking.com](https://booking.design/implementing-system-fonts-on-booking-com-a-lesson-learned-bdc984df627f).



### FIXES

#### [gradient-transparency-fix](https://github.com/gilmoreorless/postcss-gradient-transparency-fix)

Fix up CSS gradients with transparency for older browsers

#### [flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)

Tries to fix all of flexbug's issues

#### [input-style](https://github.com/seaneking/postcss-input-style)

Adds new pseudo-elements to inputs for easy cross-browser styling of their inner elements.
Currently, as of 0.3.0, supports range input controls only.

#### [selector-matches](https://github.com/postcss/postcss-selector-matches)

Transform :matches() W3C CSS pseudo class to more compatible CSS (simpler selectors)

#### [pseudoelements](https://github.com/axa-ch/postcss-pseudoelements)

Add single and double colon peudo selectors
Normalizes e.g. `::before` to `:before` for wider browser support

#### [autoprefixer](https://github.com/postcss/autoprefixer)

Parse CSS and add vendor prefixes to rules by Can I Use



### OPTIMIZATION

#### [calc](https://github.com/postcss/postcss-calc)

Reduce `calc()`.

#### [zindex](https://github.com/ben-eb/postcss-zindex)

Reduce z-index values.

#### [csso](https://github.com/lahmatiy/postcss-csso)

Adding the best CSS compressor to the chain.



### DEVELOPER FEEDBACK

#### [at-warn](https://github.com/ben-eb/postcss-at-warn)

Sass like `@warn` for PostCSS. Disabling internal usage of "postcss-reporter".

#### [reporter](https://github.com/postcss/postcss-reporter)

Log PostCSS messages to the console



## License

[Apache License Version 2.0, January 2004](license)


## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017-2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
