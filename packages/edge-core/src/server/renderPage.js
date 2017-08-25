import serialize from "serialize-javascript"
import Helmet from "react-helmet"

/**
 * Generates a full HTML page containing the render output of the given react element.
 *
 * @param config {Object} Configuration.
 * @param config.kernel {Object} Kernel instance of running application.
 * @param config.html {string} The rendered HTML content.
 * @param config.state {Object} [{}] The initial state for the redux store which will be used by the
 *   client to mount the redux store into the desired state.
 * @param config.styles {string} [""] Styles to inject into the page.
 * @param config.scripts {string} [""] Scripts to inject into the page.
 * @returns The full HTML page in the form of a React element.
 */
export default function renderPage({
  kernel,
  html,
  state,
  styles,
  scripts
}) {
  if (typeof kernel !== "object") {
    throw new Error("[EDGE]: RenderPage: Invalid kernel object!")
  }

  if (typeof kernel.intl !== "object") {
    throw new Error("[EDGE]: RenderPage: Invalid kernel object! Missing 'intl' data!")
  }

  if (typeof html !== "string" || html.length === 0) {
    throw new Error("[EDGE]: RenderPage: Invalid html string!")
  }

  if (typeof state !== "object") {
    throw new Error("[EDGE]: RenderPage: Invalid state object!")
  }

  if (typeof styles !== "object" || styles.length === 0) {
    throw new Error("[EDGE]: RenderPage: Invalid styles string!")
  }

  if (typeof scripts !== "object" || scripts.length === 0) {
    throw new Error("[EDGE]: RenderPage: Invalid scripts string!")
  }

  const helmet = Helmet.renderStatic()
  const inlineCode = `APP_STATE=${serialize(state, { isJSON: true })};`
  const nonceHtml = kernel.nonce ? `nonce="${kernel.nonce}"` : ""

  return `
<!doctype html>
<html lang="${kernel.intl.locale}" ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${styles}
    ${helmet.style.toString()}
  </head>
  <body>
    <div id="root">${html}</div>
    <script ${nonceHtml}>${inlineCode}</script>
    ${scripts}
    ${helmet.script.toString()}
  </body>
</html>`
}
