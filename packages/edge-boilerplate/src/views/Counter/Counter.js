import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"

import { loadCounter, incrementCounter, decrementCounter } from "../../modules/Counter"
import Styles from "./Counter.css"

class Counter extends React.Component {
  componentDidMount() {
    const { counter, load } = this.props

    // Load only client-side
    // Use a fallback e.g. when data not available trigger load
    return counter == null ? load() : null
  }

  fetchData() {
    const { counter, load } = this.props

    // Pre-fetch data on the server
    return counter == null ? load() : null
  }

  render() {
    const { counter, handleDecrement, handleIncrement } = this.props
    return (
      <div className={Styles.root}>
        <h2>Counter</h2>
        <p>Value: {counter}</p>
        <button onClick={handleIncrement}>Increment</button>
        <button onClick={handleDecrement}>Decrement</button>
      </div>
    )
  }
}

Counter.propTypes = {
  counter: PropTypes.number,
  handleIncrement: PropTypes.func,
  handleDecrement: PropTypes.func,
  load: PropTypes.func
}

function mapStateToProps(state, ownProps) {
  return {
    counter: state.counter.value
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleIncrement: () => dispatch(incrementCounter()),
    handleDecrement: () => dispatch(decrementCounter()),
    load: () => dispatch(loadCounter())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
