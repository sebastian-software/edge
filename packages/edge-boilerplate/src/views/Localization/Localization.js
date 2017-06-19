import React from "react"
import Helmet from "react-helmet"
import { FormattedDate, FormattedMessage, FormattedRelative } from "react-intl"
import { addDays } from "date-fns"
import cookies from "cookiesjs"
import PropTypes from "prop-types"

import Styles from "./Localization.css"

const yesterday = addDays(Date.now(), -1)

class Localization extends React.Component {
  setLocale(value) {
    cookies({ locale: value })
    location.reload()
  }

  render() {
    const { intl } = this.props

    return (
      <article>
        <Helmet title={intl.formatMessage({ id: "title" })} />
        <p>
          <FormattedMessage id="info" values={{ pi: 3.14159265359 }} />
        </p>

        <p>
          Today: <br/>
          <FormattedDate
            value={Date.now()}
            year="numeric"
            month="long"
            day="numeric"
            weekday="long"
          />
        </p>
        <p>
          Yesterday:<br/>
          <FormattedRelative value={yesterday}/>
        </p>

        <h2>Locale Selector</h2>

        <ul className={Styles.chooser}>
          <li><button onClick={() => this.setLocale("en-US")}>English</button></li>
          <li><button onClick={() => this.setLocale("de-DE")}>German</button></li>
          <li><button onClick={() => this.setLocale("fr-FR")}>France</button></li>
          <li><button onClick={() => this.setLocale("es-ES")}>Spanish</button></li>
          <li><button onClick={() => this.setLocale(null)}>Auto</button></li>
        </ul>
      </article>
    )
  }
}

Localization.propTypes = {
  intl: PropTypes.object
}

export default Localization
