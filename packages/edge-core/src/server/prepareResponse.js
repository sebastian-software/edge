import { parse } from "edge-useragent"

import getLocaleData from "./getLocaleData"

export default function prepareResponse(request) {
  const intl = getLocaleData(request)
  const userAgent = parse(request.headers["user-agent"])

  return {
    intl,
    userAgent
  }
}
