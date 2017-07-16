export default function getLocaleData(request) {
  let locale = request.locale
  let language = null
  let region = null
  let source = null

  if (locale)
  {
    language = locale.language
    region = locale.region
    source = locale.source
    locale = `${language}-${region}`
  }
  else
  {
    console.warn("Locale not auto-detected by server!")

    locale = process.env.DEFAULT_LOCALE
    if (locale) {
      source = "env"
      let splitted = locale.split("-")
      language = splitted[0]
      region = splitted[1]
    } else {
      locale = "en-US"
      language = "en"
      region = "US"
      source = "default"
    }
  }

  console.log(`Using locale: ${locale} via ${source}`)

  return {
    locale,
    language,
    region
  }
}
