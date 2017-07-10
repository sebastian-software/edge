import meow from "meow"
import chalk from "chalk"
import updateNotifier from "update-notifier"
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

`, {
    alias: {
      v: "verbose",
      q: "quiet"
    }
})

// Check for updates first
updateNotifier({ pkg }).notify()

const selectedTasks = command.input
const flags = command.flags

console.log(chalk.bold("EDGE " + chalk.green("v" + pkg.version)))
console.log(commands)
console.log(flags)

const availableTasks = [
  { task: "build", commands: [ cleanClient, cleanServer, buildClient, buildServer ] },
  { task: "dev", commands: [ startDevServer ] }
]

function executeCommands(listOfCommands) {
  listOfCommands.forEach((command) => {
    console.log("Executing...")
    command()
  })
}

for (let taskName of selectedTasks) {
  for (let taskConfig of availableTasks) {
    if (taskConfig.task === taskName) {
      executeCommands(taskConfig.commands)
    }
  }
}
