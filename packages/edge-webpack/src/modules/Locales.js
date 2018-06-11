import webpack from "webpack"

export const APP_LOCALES = process.env.APP_LOCALES ?
  process.env.APP_LOCALES.split(",") :
  [ process.env.APP_DEFAULT_LOCALE || "en-US" ]

const LOCALES_MATCHER = new RegExp(`\\b(${APP_LOCALES.join("|")})\\b`)
const LANGUAGES_MATCHER = new RegExp(
  `\\b(${APP_LOCALES.map((entry) => entry.split("-")[0]).join("|")})\\b`
)

export default {
  plugins: [
    // Fix context imports in Webpack to the supported locales
    // This entry is for lean-intl which uses locale specific data packs
    new webpack.ContextReplacementPlugin(
      /lean-intl[/\\]locale-data[/\\]js$/,
      LOCALES_MATCHER
    ),

    // Fix context imports in Webpack to the supported locales
    // This entry is for react-intl which uses language specific data packs
    new webpack.ContextReplacementPlugin(
      /react-intl[/\\]locale-data$/,
      LANGUAGES_MATCHER
    )
  ]
}
