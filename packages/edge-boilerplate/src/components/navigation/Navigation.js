import React from "react"
import { Link } from "@reach/router"

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/counter">Counter</Link>
        </li>
        <li>
          <Link to="/localization">Localization</Link>
        </li>
      </ul>
    </nav>
  )
}
