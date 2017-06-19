import React from "react"
import Helmet from "react-helmet"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import Styles from "./Redux.css"
import { getCounter, decrementCounter, incrementCounter, loadCounter } from "../../modules/Counter"

import "prismjs/themes/prism-tomorrow.css"

/**
 * @deprecated
 */
function handleOldMethodCall() {
  // nothing to do
}

class About extends React.Component {
  componentDidMount() {
    // Good strategy to load relevant data: wait after rendering
    // so that the user sees the empty state. We can't really wait
    // in render sequence for any data coming in.
    return this.props.value == null ? this.props.load() : null
  }

  fetchData()
  {
    // Load data on all preparation steps e.g. on SSR and also on rehydration on client
    // when intially loading this route.
    return this.props.value == null ? this.props.load() : null
  }

  render() {
    return (
      <article>
        <Helmet title="Redux" />

        <p>
          Current Value: {this.props.value}
        </p>

        <p>
          <button className={Styles.button} onClick={this.props.handleDecrement}>Decrement</button>
          &#160;
          <button className={Styles.button} onClick={this.props.handleIncrement}>Increment</button>
          &#160;
          <button className={Styles.button} onClick={handleOldMethodCall}>Deprecated Test</button>
        </p>
      </article>
    )
  }
}

About.propTypes = {
  intl: PropTypes.object,
  value: PropTypes.number,
  load: PropTypes.func,
  handleIncrement: PropTypes.func,
  handleDecrement: PropTypes.func
}

const mapStateToProps = (state, ownProps) => ({
  value: getCounter(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleIncrement: () => dispatch(incrementCounter()),
  handleDecrement: () => dispatch(decrementCounter()),
  load: () => dispatch(loadCounter())
})

export default connect(mapStateToProps, mapDispatchToProps)(About)
