/* eslint-disable max-len */
import "universal-dotenv"

export const IS_PRODUCTION = process.env.NODE_ENV === "production"
export const IS_TEST = process.env.NODE_ENV === "test"
export const IS_DEVELOPMENT = !IS_PRODUCTION && !IS_TEST

export const BUILD_TARGET = process.env.BUILD_TARGET || "client"

export const ENABLE_SOURCE_MAPS = true

export const ASSET_EXTS = /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html|ico|xml)$/
export const BABEL_EXTS = /\.(js|mjs|jsx)$/
export const POSTCSS_EXTS = /\.(css|sss|pcss)$/
export const POSTCSS_MODULE_EXTS = /\.module\.(css|sss|pcss)$/
export const COMPRESSABLE_EXTS = /\.(ttf|otf|svg|pdf|html|ico|txt|md|html|js|css|json|xml)$/
export const YAML_EXTS = /\.(yml|yaml)$/
export const GRAPHQL_EXTS = /\.(graphql|gql)$/
