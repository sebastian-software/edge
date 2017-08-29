import React from "react"
import Helmet from "react-helmet"

import Styles from "./Home.css"

export default function Home() {
  return (
    <article>
      <Helmet title="Home" />
      <div className={Styles.preloader} />
      <p className={Styles.intro}>
        <a href="https://github.com/sebastian-software">Produced with ❤ by Sebastian Software</a>
      </p>
    </article>
  )
}
