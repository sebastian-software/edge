import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

/**
 * Wraps the given component to make it only visible when the current
 * navigation matches the redux router type.
 *
 * @param {Component} ChildComponent Component to wrap.
 * @param {string} type Redux-Route Type to match for make visible.
 */
export default function routed(ChildComponent, type) {
  function RouteTarget({ currentLocation, currentPayload }) {
    if (type === currentLocation) {
      return <ChildComponent {...currentPayload} />
    }

    return null
  }

  RouteTarget.propTypes = {
    type: PropTypes.string,
    currentLocation: PropTypes.string,
    currentPayload: PropTypes.object
  }

  function mapStateToProps(state, ownProps) {
    return {
      currentLocation: state.location.type,
      currentPayload: state.location.payload
    }
  }

  return connect(mapStateToProps)(RouteTarget)
}
