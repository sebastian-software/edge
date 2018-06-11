export const APP_TITLE = "Init Display"
export const IS_CLIENT = true
export const IS_SERVER = false

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development"
export const IS_PRODUCTION = !IS_DEVELOPMENT
export const MODE = IS_DEVELOPMENT ? "development" : "production"

export const ENABLE_SOURCE_MAPS = true

export const APP_LOCALES = [ "de-DE", "fr-FR", "es-ES", "en-US" ]

export const ASSET_EXTS = /\.(eot|woff|woff2|ttf|otf|svg|png|jpg|jpeg|jp2|jpx|jxr|gif|webp|mp4|mp3|ogg|pdf|html|ico|xml)$/
export const BABEL_EXTS = /\.(js|mjs|jsx)$/
export const POSTCSS_EXTS = /\.(css|sss|pcss)$/
export const POSTCSS_MODULE_EXTS = /\.module\.(css|sss|pcss)$/
export const COMPRESSABLE_EXTS = /\.(ttf|otf|svg|pdf|html|ico|txt|md|html|js|css|json|xml)$/
export const YAML_EXTS = /\.(yml|yaml)$/
export const GRAPHQL_EXTS = /\.(graphql|gql)$/

export const CSS_LOADER_OPTS = {
  import: false,

  // We are using CSS-O as part of our PostCSS-Chain
  minimize: false,
  sourceMap: ENABLE_SOURCE_MAPS
}

export const CSS_LOADER_MODULE_OPTS = {
  ...CSS_LOADER_OPTS,
  modules: true,
  localIdentName: "[local]-[hash:base62:8]"
}

export const POSTCSS_LOADER_OPTS = {
  sourceMap: ENABLE_SOURCE_MAPS
}
