import PropTypes from "prop-types"
import React from "react"
import { FormattedMessage } from "react-intl"

import Styles from "./ErrorPlaceholder.module.css"

export default function ErrorPlaceholder({ error }) {
  return (
    <>
      <h3><FormattedMessage id="generic.error.title" /></h3>
      <p><FormattedMessage id="router.codesplit.error" /></p>
      <pre className={Styles.log}>
        {error.message}
      </pre>
    </>
  )
}

Error.propTypes = {
  error: PropTypes.object
}
