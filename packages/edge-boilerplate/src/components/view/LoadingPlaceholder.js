import React from "react"
import { FormattedMessage } from "react-intl"

export default function LoadingPlaceholder() {
  return (
    <>
      <h3><FormattedMessage id="generic.info.title" /></h3>
      <p><FormattedMessage id="router.codesplit.loading" /></p>
    </>
  )
}
