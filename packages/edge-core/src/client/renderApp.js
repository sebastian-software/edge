import React from "react"
import { render } from "react-dom"
import { ApolloProvider } from "react-apollo"
import { IntlProvider } from "react-intl"

export default function renderApp(AppRoot, { apolloClient, reduxStore, messages })
{
  const locale = window.APP_STATE.ssr.locale

  const WrappedRoot = (
    <IntlProvider locale={locale} messages={messages}>
      <ApolloProvider client={apolloClient} store={reduxStore}>
        <AppRoot/>
      </ApolloProvider>
    </IntlProvider>
  )

  render(WrappedRoot, document.getElementById("app"))
}
