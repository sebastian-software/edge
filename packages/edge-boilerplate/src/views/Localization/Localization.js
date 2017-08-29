import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Helmet from "react-helmet"
import cookies from "cookiesjs"
import { FormattedNumber, FormattedDate, FormattedTime, FormattedRelative } from "react-intl"
import { getLocale } from "edge-core"

import Styles from "./Localization.css"

const time = new Date()
const timeDiff = 100000

function switchLocale(locale) {
  cookies({ locale })
  window.location.reload()
}

function Localization({ locale }) {
  return (
    <div className={Styles.root}>
      <Helmet title="Localization"/>
      <h2>Locale: {locale}</h2>
      <ul>
        <li>FormattedNumber: <FormattedNumber value={3.14}/></li>
        <li>FormattedNumber: <FormattedNumber value={3402859302}/></li>
        <li>FormattedDate: <FormattedDate value={time}/></li>
        <li>FormattedTime: <FormattedTime value={time}/></li>
        <li>FormattedRelative: <FormattedRelative value={time - timeDiff}/></li>
      </ul>
      <h2>Select Locale:</h2>
      <ul>
        <li><a href="#" onClick={() => switchLocale("de-DE")}>Deutsch (Deutschland)</a></li>
        <li><a href="#" onClick={() => switchLocale("fr-CH")}>Français (France)</a></li>
        <li><a href="#" onClick={() => switchLocale("en-US")}>English (USA)</a></li>
      </ul>
    </div>
  )
}

Localization.propTypes = {
  locale: PropTypes.string
}

function mapStateToProps(state, ownProps) {
  return {
    locale: getLocale(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Localization)
