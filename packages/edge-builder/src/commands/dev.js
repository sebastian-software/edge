import formatWebpackMessages from "react-dev-utils/formatWebpackMessages"
import chalk from "chalk"

import createExpress from "../express/createExpressServer"
import { addDevMiddleware } from "../express/dev"

const DEVELOPMENT_PORT = process.env.DEVELOPMENT_PORT
const IS_INTERACTIVE = process.stdout.isTTY

export function startDevServer() {
  /* eslint-disable no-console */

  const server = createExpress({})
  const multiCompiler = addDevMiddleware(server)

  // const clientCompiler = multiCompiler.compilers[0]
  // const serverCompiler = multiCompiler.compilers[1]

  let serverIsStarted = false

  multiCompiler.plugin("invalid", () => {
    console.log("Compiling...")
  })

  multiCompiler.plugin("done", (stats) => {
    const rawMessages = stats.toJson({})
    const messages = formatWebpackMessages(rawMessages)

    const isSuccessful = !messages.errors.length && !messages.warnings.length
    if (isSuccessful) {
      console.log(chalk.green("Compiled successfully!"))
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.red("Failed to compile.\n"))
      console.log(messages.errors.join("\n\n"))
      return
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow("Compiled with warnings.\n"))
      console.log(messages.warnings.join("\n\n"))
    }

    if (!stats.hasErrors() && !serverIsStarted) {
      serverIsStarted = true

      server.listen(DEVELOPMENT_PORT, () => {
        console.log(`Development Server started @ Port ${DEVELOPMENT_PORT}`)
      })
    }
  })
}
