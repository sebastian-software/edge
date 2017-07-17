import meow from "meow"
import chalk from "chalk"
import updateNotifier from "update-notifier"
import Promise from "bluebird"
import { get as getRoot } from "app-root-dir"

import { buildClient, buildServer, cleanClient, cleanServer } from "./commands/build"
import { startDevServer } from "./commands/dev"
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
    build           Build production appliction
    build:server    Build server part of production appliction
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

console.log(chalk.bold("EDGE " + chalk.green("v" + pkg.version)) + appInfo)

// Check for updates first
updateNotifier({ pkg }).notify()

// List of tasks we have available
const availableTasks = [
  { task: "clean", commands: [ cleanClient, cleanServer ] },
  { task: "build", commands: [ cleanClient, cleanServer, buildClient, buildServer ] },
  { task: "build:server", commands: [ cleanServer, buildServer ] },
  { task: "dev", commands: [ cleanClient, cleanServer, startDevServer ] }
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
