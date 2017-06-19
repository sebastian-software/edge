import React from "react"
import Helmet from "react-helmet"
import PropTypes from "prop-types"

import Styles from "./Home.css"

function Home({ intl }) {
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

Home.propTypes = {
  intl: PropTypes.object
}

export default Home
