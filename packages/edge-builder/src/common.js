import dotenv from "dotenv"
import cosmiconfig from "cosmiconfig"
import { get as getRoot } from "app-root-dir"
import { relative } from "path"
import chalk from "chalk"

/* eslint-disable no-process-exit, no-console */

// Initialize environment configuration
dotenv.config()

// Export common understanding of what ROOT is
export const ROOT = getRoot()

// Read edge configuration
const configLoader = cosmiconfig("edge", {
  // allow extensions on rc files
  rcExtensions: true,

  // Force stop at project root folder
  stopDir: ROOT
})

const configPromise = configLoader.load(ROOT).then((configResult) => {
  console.log(`Loaded config from ${relative(ROOT, configResult.filepath)}`)
  return configResult.config
}).catch((error) => {
  throw new Error(`Error parsing config file: ${error}`)
})

if (!configPromise) {
  console.error(chalk.red("Edge: Missing configuration file!"))
  process.exit(1)
}

export async function getConfig() {
  return await configPromise
}
