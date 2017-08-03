import meow from "meow"
import chalk from "chalk"
import updateNotifier from "update-notifier"
import Promise from "bluebird"
import clearConsole from "react-dev-utils/clearConsole"
import { ROOT, getConfig } from "./common"

import { buildClient, buildServer, cleanClient, cleanServer } from "./commands/build"
import { startDevServer } from "./commands/dev"
import { startReactServer } from "./commands/react"
import { startStaticServer } from "./commands/static"

import pkg from "../package.json"

const appPkg = require(ROOT + "/package.json")
const appInfo = " running on " + chalk.bold.blue(appPkg.name) + "-" + appPkg.version

const IS_INTERACTIVE = process.stdout.isTTY

if (IS_INTERACTIVE) {
  clearConsole()
}

console.log(chalk.bold("EDGE " + chalk.green("v" + pkg.version)) + appInfo)

// Parse arguments
const command = meow(`
  Usage:
    $ edge <command>

  Options:
    --config        Path to configuration file.
    --verbose, -v   Generate verbose output messages.
    --quiet, -q     Reduce amount of output messages to warnings and errors.

  Commands:
    dev             Start development server
    start:dev       Start development server
    start:react     Start production universal React server
    start:static    Start production static server
    build           Build production appliction
    build:client    Build client part of production application
    build:server    Build server part of production application
    clean           Clean up all generated files
`, {
    alias: {
      v: "verbose",
      q: "quiet"
    }
})

const selectedTasks = command.input
const flags = command.flags

// Check for updates first
/* eslint-disable no-magic-numbers */
updateNotifier({
  pkg,

  // check every hour
  updateCheckInterval: 1000 * 60 * 60
}).notify()

// List of tasks we have available
const availableTasks = [
  { task: "clean", commands: [ cleanClient, cleanServer ] },
  { task: "build", commands: [ cleanClient, cleanServer, buildClient, buildServer ] },
  { task: "build:client", commands: [ cleanClient, buildClient ] },
  { task: "build:server", commands: [ cleanServer, buildServer ] },
  { task: "dev", commands: [ cleanClient, cleanServer, startDevServer ] },
  { task: "start:dev", commands: [ cleanClient, cleanServer, startDevServer ] },
  { task: "start:react", commands: [ cleanClient, cleanServer, buildClient, buildServer, startReactServer ] },
  { task: "start:react:plain", commands: [ startReactServer ] },
  { task: "start:static", commands: [ cleanClient, cleanServer, buildClient, startStaticServer ] },
  { task: "start:static:plain", commands: [ startStaticServer ] }
]

// Prevent deprecation messages which should not be displayed to the end user
if (!flags.verbose) {
  process.noDeprecation = true
}

/* eslint-disable no-process-exit, max-depth, no-console, no-use-extend-native/no-use-extend-native */

function executeCommands(listOfCommands, config) {
  const mergedConfig = { ...config, ...flags }
  return Promise.each(listOfCommands, (item) => item(mergedConfig))
}

async function executeTasks() {
  const config = await getConfig()

  for (let taskName of selectedTasks) {
    for (let taskConfig of availableTasks) {
      if (taskConfig.task === taskName) {
        try {
          await executeCommands(taskConfig.commands, config)
        } catch (error) {
          console.error(chalk.bold.red(`Failed to execute task: ${taskName}!`))
          console.error(error)
          process.exit(1)
        }
      }
    }
  }
}

if (selectedTasks) {
  process.nextTick(executeTasks)
} else {
  command.showHelp()
}
