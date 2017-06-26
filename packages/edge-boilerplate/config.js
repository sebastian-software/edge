import { get as getRoot } from "app-root-dir"
import { resolve } from "path"

export const ROOT = getRoot()

export const SERVER_OUTPUT = resolve(ROOT, "build/server")
export const CLIENT_OUTPUT = resolve(ROOT, "build/client")

export const PUBLIC_PATH = "/static/"

export const SERVER_ENTRY = resolve(ROOT, "src/server/index.js")
export const CLIENT_ENTRY = resolve(ROOT, "src/client/index.js")

export const DEVELOPMENT_PORT = 1339
export const PRODUCTION_PORT = 1339
