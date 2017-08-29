import React from "react"
import PropTypes from "prop-types"
import Styles from "./Missing.css"

function Missing() {
  return (
    <div className={Styles.root}>
      <h2>Sorry, that page was not found.</h2>
    </div>
  )
}

Missing.propTypes = {
  intl: PropTypes.object
}

export default Missing
