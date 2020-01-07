import * as React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import App from 'shared/containers/App'
import { Provider } from 'react-redux'
import { consoleProxy } from 'prod-console'
import StyleContext from 'isomorphic-style-loader/StyleContext'
import { HelmetProvider } from 'react-helmet-async'
import { loadableReady } from '@loadable/component'

import createHistory from 'shared/utils/history'
import IntlProvider from 'shared/i18n/IntlProvider'
import storeManager from 'shared/configureStore'
import { WINDOW_STORE } from 'shared/utils/constants'

const { NODE_ENV } = process.env

if (NODE_ENV === 'production') {
  const prodConsole = consoleProxy({ monitor: true })
  prodConsole.switchConsole('off')
}

const store = storeManager.getStore(window[WINDOW_STORE])

const history = createHistory()

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss())
  return () => removeCss.forEach(dispose => dispose())
}

const content = (
  <Provider store={store}>
    <Router history={history}>
      <StyleContext.Provider value={{ insertCss }}>
        <IntlProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </IntlProvider>
      </StyleContext.Provider>
    </Router>
  </Provider>
)

const placeHolder = document.getElementById('app')

if (__BROWSER__) {
  ReactDOM.render(content, placeHolder)
} else {
  loadableReady(() => {
    ReactDOM.hydrate(content, placeHolder)
  })
}

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept()
  }
}
