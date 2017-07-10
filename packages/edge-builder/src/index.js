import gulp from "gulp"
import runSequence from "run-sequence"
import { addDevMiddleware } from "./express/dev"
import dotenv from "dotenv"
import { cleanClient, cleanServer, buildClient, buildServer } from "./commands/build"
import { startDevServer } from "./commands/dev"

export {
  addDevMiddleware,
  cleanClient, cleanServer, buildClient, buildServer,
  startDevServer
}

// Initialize environment configuration
dotenv.config()

export function addGulpTasks() {
  gulp.task("clean:server", cleanServer)
  gulp.task("clean:client", cleanClient)
  gulp.task("build:server", [ "clean:server" ], buildServer)
  gulp.task("build:client", [ "clean:client" ], buildClient)
  gulp.task("build", (callback) => {
    runSequence("build:client", "build:server", callback)
  })
  gulp.task("start:dev", startDevServer)
}
