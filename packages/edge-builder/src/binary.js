import meow from "meow"
import chalk from "chalk"
import updateNotifier from "update-notifier"
import Promise from "bluebird"
import { get as getRoot } from "app-root-dir"
import clearConsole from "react-dev-utils/clearConsole"

import { buildClient, buildServer, cleanClient, cleanServer } from "./commands/build"
import { startDevServer } from "./commands/dev"
import { startReactServer } from "./commands/react"
import { startStaticServer } from "./commands/static"

import pkg from "../package.json"

// Parse arguments
const command = meow(`
  Usage:
    $ edge <command>

  Options:
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

const appPkg = require(getRoot() + "/package.json")
const appInfo = " running on " + chalk.bold.blue(appPkg.name) + "-" + appPkg.version

const selectedTasks = command.input
const flags = command.flags

const IS_INTERACTIVE = process.stdout.isTTY

if (IS_INTERACTIVE) {
  clearConsole()
}

console.log(chalk.bold("EDGE " + chalk.green("v" + pkg.version)) + appInfo)

// Check for updates first
updateNotifier({ pkg }).notify()

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

/* eslint-disable no-process-exit */

function executeCommands(listOfCommands) {
  return Promise.each(listOfCommands, (item) => item())
}

async function executeTasks() {
  for (let taskName of selectedTasks) {
    for (let taskConfig of availableTasks) {
      if (taskConfig.task === taskName) {
        await executeCommands(taskConfig.commands)
      }
    }
  }
}

process.nextTick(executeTasks)
