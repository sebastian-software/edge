import React from "react"
import PropTypes from "prop-types"

export default class FocusedField extends React.Component {
  componentDidMount() {
    this.input.focus()
  }

  render() {
    return (
      <input
        type="text"
        value={this.props.value}
        ref={(node) => (this.input = node)}
        onChange={(event) => this.props.onChange(event.target.value)}
      />
    )
  }
}

FocusedField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}
