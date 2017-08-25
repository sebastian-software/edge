import { parse } from "edge-useragent"

import getLocaleData from "./getLocaleData"

export default function prepareResponse(request) {
  const intl = getLocaleData(request)
  const browser = parse(request.headers["user-agent"])

  return {
    intl,
    browser
  }
}
