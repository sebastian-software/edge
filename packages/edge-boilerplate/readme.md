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

## Thanks

- James Gillmore @faceyspacey


## Features

- Server Side React Rendering for excellent SEO Support and very high Mobile Performance.
- Semi-Automatic Code-Splitting for both CSS and JS.
- Hot Loading for Client and Server using Webpack Multi Compiler Architecture.
- PostCSS powered CSS pipeline with Sass-inspired features.
- CSS Modules for Component Style Isolation.

WIP:

- Build Caching using Webpacks Cache-Loader.
- Efficient Long-Term-Caching using Hashed File Names.
- React Helmet for Efficient Header Element Handling
- Distributed Routing Rules via React Router v4
- Redux Infrastructure Built-In


## Technology

- [webpack-flush-chunks](https://github.com/faceyspacey/webpack-flush-chunks)
- [react-universal-component](https://github.com/faceyspacey/react-universal-component)
- [extract-css-chunks-webpack-plugin](https://github.com/faceyspacey/extract-css-chunks-webpack-plugin)


## Usage

```sh
yarn start
yarn run start:prod
```

After selecting one of the above commands, open [localhost:3000](http://localhost:3000) in your browser. View the source in the browser to see what chunks are being sent.



## Notes

If you're not embedding CSS directly in your response strings, you can forget about ushering the `outputPath` to your `serverRender` function. Keep in mind though that if you do, and if you render the server with Webpack this can become a time-sink to figure out for those not familiar with how Webpack mocks the file system. Basically by default the file system won't be what you expect it to be if you call `path.resolve(__dirname, '..')` within a webpack-compiled portion of your code, which is why it's very nice how [webpack-hot-server-middleware](https://github.com/60frames/webpack-hot-server-middleware) allows you to pass options from Babel code where you can get your bundle's output path resolved properly. Universal Webpack is awesome, but has a few hurdles to doing correctly, particularly in development. [webpack-hot-server-middleware](https://github.com/60frames/webpack-hot-server-middleware) solves those hurdles.

Hopefully insights from this boilerplate simplifies things for you. The key is to recognize the boundary this boilerplate has chosen between what server code is compiled by Webpack and what code is compiled by Babel. The boundary specifically is [`server/index.webpack.js`](./server/index.webpack.js), which is handled by Babel and [`server/render.js`](./server/render.js), which is handled by Webpack--both of which are run on the server.

If you haven't rendered your server with Webpack before, now's a good time to give the Webpack boilerplates a try. Helping make that--along with *complete HMR*--more of a mainstream thing is a side aim of these repos.


## Final Note: Hot Module Replacement

> this basically applies to the universal webpack boilerplates

You will notice that the server code is watched with `babel-watch` in `package.json`. The goal is obviously HMR everywhere, since no matter what some of your code is built outside of Webpack.

There is one gotcha with that though: if you edit the server code (not compiled by Webpack), it will update, but then connection to the client will be lost, and you need to do a refresh. This is very useful for cases where you are actively refreshing, such as when you're checking the output from you server in your browser source code tab, but obviously not the pinnacle in universal HMR.

However, when your not editing your `express` code much, and if you're editing webpack-compiled code (whether rendered on the client or server), HMR will isomorphically work with no unexpected hiccups; and that *awesomeness* is likely what you'll experience most of the time. That's one of the key benefits of [webpack-hot-server-middleware](https://github.com/60frames/webpack-hot-server-middleware).

If you have a solution to reconnecting the client to HMR after `babel-watch` reloads the server code, we'd love to hear it.

*Long live the dreams of Universal HMR* and ***Universal Code-Splitting!***


## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://raw.githubusercontent.com/sebastian-software/readable-code/master/assets/sebastiansoftware.png" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
