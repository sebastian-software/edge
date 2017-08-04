export default function getBrowserLocale(supported) {
  const supported = new Set()
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
  return {
    locale: first,
    language: first.split("-")[0],
    region: first.split("-")[1] || first.split("-")[0].toUpperCase()
  }
}
