import dotenv from "dotenv"

// Initialize environment configuration
dotenv.config()

export { default as addCoreMiddleware } from "./addCoreMiddleware"
export { default as addErrorMiddleware } from "./addErrorMiddleware"
export { default as addFallbackHandler } from "./addFallbackHandler"
export { default as addSecurityMiddleware } from "./addSecurityMiddleware"
export { default as createExpressServer } from "./createExpressServer"
