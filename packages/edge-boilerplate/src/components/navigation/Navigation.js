import React from "react"
import { NavLink } from "redux-first-router-link"

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to={{ type: "HOME" }}>Home</NavLink>
        </li>
        <li>
          <NavLink to={{ type: "COUNTER" }}>Counter</NavLink>
        </li>
        <li>
          <NavLink to={{ type: "LOCALIZATION" }}>Localization</NavLink>
        </li>
      </ul>
    </nav>
  )
}
