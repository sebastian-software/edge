import React from "react"
import { Provider } from "react-redux"
import { ApolloProvider } from "react-apollo"
import { IntlProvider } from "react-intl"

export default function wrapApplication(Application, { locale, messages, apolloClient, reduxStore }) {
  let Wrapped = Application

  if (apolloClient) {
    Wrapped = (
      <ApolloProvider client={apolloClient} store={reduxStore}>
        <Wrapped/>
      </ApolloProvider>
    )
  }

  if (reduxStore) {
    Wrapped = (
      <Provider store={reduxStore}>
        <Wrapped/>
      </Provider>
    )
  }

  if (locale) {
    Wrapped = (
      <IntlProvider locale={locale} messages={messages}>
        <Wrapped/>
      </IntlProvider>
    )
  }

  return Wrapped
}
