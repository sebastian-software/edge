import PropTypes from "prop-types"
import React from "react"

import ErrorPlaceholder from "./ErrorPlaceholder"
import LoadingPlaceholder from "./LoadingPlaceholder"

export default function ViewWrapper(props) {
  const { Component, loading, error, ownProps } = props
  if (loading) {
    return <LoadingPlaceholder />
  }

  if (error) {
    return <ErrorPlaceholder error={error}/>
  }

  return Component ? <Component {...ownProps} /> : null
}

ViewWrapper.propTypes = {
  Component: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.object,
  ownProps: PropTypes.object
}
