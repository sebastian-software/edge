/**
 * Returns the browser locale settings based on available locales and browser settings.
 *
 * @param {Array} supportedLocales List of supported locales by the application.
 */
export default function getBrowserLocale(supportedLocales) {
  return process.env.TARGET === "web" ? _getBrowserLocale(supportedLocales) : null
}

function _getBrowserLocale(supportedLocales) {
  const supported = new Set(supportedLocales)
  const available = new Set()

  // Modern standard: Support by modern Chrome, Safari and Firefox
  const languages = navigator.languages
  if (languages) {
    for (let lang of languages) {
      if (supported.has(lang)) {
        available.add(lang)
      }
    }
  }

  // Microsoft standard
  const userLanguage = navigator.userLanguage
  if (userLanguage) {
    const wellFormedUserLanguage = (() => {
      const splitted = userLanguage.split("-")
      return `${splitted[0]}-${splitted[1].toUpperCase()}`
    })()

    if (supported.has(wellFormedUserLanguage)) {
      available.add(wellFormedUserLanguage)
    }
  }

  // Legacy API
  const language = navigator.language
  if (language && supported.has(language)) {
    available.add(language)
  }

  // Return only the first match
  const first = Array.from(available.values())[0]
  return first ? {
    locale: first,
    language: first.split("-")[0],
    region: first.split("-")[1] || first.split("-")[0].toUpperCase()
  } : null
}
