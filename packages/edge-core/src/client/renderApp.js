import { render } from "react-dom"
import wrapApplication from "../common/wrapApplication"

export default function renderApp(Application, config) {
  render(wrapApplication(Application, config), document.getElementById("root"))
}
