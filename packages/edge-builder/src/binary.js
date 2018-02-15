import meow from "meow"
import chalk from "chalk"
import updateNotifier from "update-notifier"
import Promise from "bluebird"
import clearConsole from "react-dev-utils/clearConsole"

import { loadConfig, NAME, VERSION } from "edge-common"
import {
  buildClient,
  buildServer,
  cleanClient,
  cleanServer
} from "./commands/build"

import pkg from "../package.json"

const IS_INTERACTIVE = process.stdout.isTTY

if (IS_INTERACTIVE) {
  clearConsole()
}

console.log(
  `${chalk.bold(
    `EDGE ${chalk.green(`v${pkg.version}`)}`
  )} running on ${chalk.bold.blue(NAME)}-${VERSION}`
)

// Parse arguments
const command = meow(
  `
  Usage:
    $ edge <command>

  Options:
    --config        Path to configuration file.
    --verbose, -v   Generate verbose output messages.
    --quiet, -q     Reduce amount of output messages to warnings and errors.

  Commands:
    build           Build production appliction
    build:client    Build client part of production application
    build:server    Build server part of production application
    clean           Clean up all generated files
`,
  {
    flags: {
      verbose: {
        alias: "v",
        default: false
      },
      quiet: {
        alias: "q",
        default: false
      }
    }
  }
)

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
  {
    task: "build",
    commands: [ cleanClient, cleanServer, buildClient, buildServer ]
  },
  { task: "build:client", commands: [ cleanClient, buildClient ] },
  { task: "build:server", commands: [ cleanServer, buildServer ] }
]

// Prevent deprecation messages which should not be displayed to the end user
if (!flags.verbose) {
  process.noDeprecation = true
}

/* eslint-disable no-process-exit, max-depth, no-console */

function executeCommands(listOfCommands, config) {
  /* eslint-disable no-use-extend-native/no-use-extend-native */
  return Promise.each(listOfCommands, (item) => item(config))
}

async function executeTasks() {
  const { config } = await loadConfig("edge", flags)

  for (const taskName of selectedTasks) {
    for (const taskConfig of availableTasks) {
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

if (selectedTasks.length > 0) {
  process.nextTick(executeTasks)
} else {
  command.showHelp()
}
