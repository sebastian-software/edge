import React from "react"

import { Provider } from "react-redux"
import { ApolloProvider } from "react-apollo"
import { IntlProvider } from "react-intl"

/**
 * Wraps the application class with different providers for offering the
 * following features:
 *
 * - Apollo GraphQL
 * - Redux
 * - React Intl
 *
 * This might be extended with new features during development.
 *
 * @param {React.Component} Application The React root application component.
 * @param {Kernel} kernel Kernel instance which holds the data oriented runtime state.
 * @returns {React.Component} Returns the wrapped application component.
 */
export default function wrapApplication(Application, kernel) {
  let Wrapped = Application

  if (kernel.apolloClient) {
    Wrapped = (
      <ApolloProvider client={kernel.apolloClient} store={kernel.reduxStore}>
        {Wrapped}
      </ApolloProvider>
    )
  }

  if (kernel.reduxStore) {
    Wrapped = (
      <Provider store={kernel.reduxStore}>
        {Wrapped}
      </Provider>
    )
  }

  if (kernel.intl) {
    Wrapped = (
      <IntlProvider locale={kernel.intl.locale}>
        {Wrapped}
      </IntlProvider>
    )
  }

  return Wrapped
}
