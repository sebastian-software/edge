import serialize from "serialize-javascript"
import Helmet from "react-helmet"

/**
 * Generates a full HTML page containing the render output of the given react element.
 *
 * @param config {Object} Configuration.
 * @param config.html {string} The rendered HTML content.
 * @param config.initialState {Object} [{}] The initial state for the redux store which will be used by the
 *   client to mount the redux store into the desired state.
 * @param config.nonce {string} [""] Nonce for securing origin.
 * @param config.locale {string} [""] Selected locale to send to the user.
 * @param config.styles {string} [""] Styles to inject into the page.
 * @param config.scripts {string} [""] Scripts to inject into the page.
 * @returns The full HTML page in the form of a React element.
 */
export default function renderPage({
  html,
  initialState = {},
  nonce,
  locale, styles,
  scripts
}) {
  const helmet = Helmet.renderStatic()
  const inlineCode = `APP_STATE=${serialize(initialState, { isJSON: true })};`

  return `
<!doctype html>
<html lang="${locale}" ${helmet ? helmet.htmlAttributes.toString() : ""}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${styles}
    ${helmet.style.toString()}
  </head>
  <body>
    <div id="root">${html}</div>
    <script nonce="${nonce}">${inlineCode}</script>
    ${scripts}
    ${helmet.script.toString()}
  </body>
</html>`
}
