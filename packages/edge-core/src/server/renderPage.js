import serialize from "serialize-javascript"

/**
 * Generates a full HTML page containing the render output of the given react
 * element.
 *
 * @param rootReactElement
 *   [Optional] The root React element to be rendered on the page.
 * @param initialState
 *   [Optional] The initial state for the redux store which will be used by the
 *   client to mount the redux store into the desired state.
 *
 * @returns The full HTML page in the form of a React element.
 */
export default function renderPage({ renderedApp, initialState = {},
  nonce, helmet, language, region }) {

  let inlineCode = `APP_STATE=${serialize(initialState, { isJSON: true })};`

  const langValue = region ? `${language}-${region}` : language

  return `<!doctype html>
    <html lang="${langValue}" ${helmet ? helmet.htmlAttributes.toString() : ""}>
      <head>
        ${helmet ? helmet.title.toString() : ""}
        ${helmet ? helmet.meta.toString() : ""}
        ${helmet ? helmet.link.toString() : ""}
        ${helmet ? helmet.style.toString() : ""}
      </head>
      <body>
        <div id="app">${renderedApp || ""}</div>

        <script nonce="${nonce}">${inlineCode}</script>
        ${helmet ? helmet.script.toString() : ""}
      </body>
    </html>`
}
