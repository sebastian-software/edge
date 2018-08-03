import Helmet from "react-helmet"
import React from "react"

/* eslint-disable import/no-webpack-loader-syntax */

import AppleTouchIcon from "./apple-touch-icon.png"
import ClassicFavicon from "./favicon.ico"
import FavIcon16 from "./favicon-16x16.png"
import FavIcon32 from "./favicon-32x32.png"
import Manifest from "./manifest.webmanifest"
import SafariPinned from "./safari-pinned-tab.svg"

export default function HtmlHead() {
  return (
    /* eslint-disable no-inline-comments */
    <Helmet titleTemplate="%s - Edge Boilerplate">
      <meta charSet="utf-8" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link rel="apple-touch-icon" sizes="180x180" href={AppleTouchIcon} />

      <link rel="icon" type="image/png" sizes="32x32" href={FavIcon32} />
      <link rel="icon" type="image/png" sizes="16x16" href={FavIcon16} />

      <link rel="manifest" href={Manifest} />
      <link rel="mask-icon" href={SafariPinned} color="#2581c4" />
      <link rel="shortcut icon" href={ClassicFavicon} />

      <meta name="theme-color" content="#ffffff" />

      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* http://httpwg.org/http-extensions/client-hints.html */}
      <meta property="Accept-CH" content="DPR, Width, Viewport-Width" />

      <meta
        name="viewport"
        content="width=device-width,maximum-scale=1,minimum-scale=1,initial-scale=1"
      />
    </Helmet>
  )
}
