import * as React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import App from 'shared/containers/App'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { consoleProxy } from 'prod-console'
import i18next from 'i18next'
import StyleContext from 'isomorphic-style-loader/StyleContext'

import history from 'shared/utils/history'
import i18n from 'shared/utils/i18n.js'
import configureStore, { staticStore } from 'shared/configureStore'
import { WINDOW_STORE } from 'shared/utils/constants'

const { NODE_ENV } = process.env
let store

if (NODE_ENV === 'production') {
  const prodConsole = consoleProxy({ monitor: true })
  prodConsole.switchConsole('off')
  store = configureStore(window[WINDOW_STORE])
} else {
  store = staticStore
}

const insertCss = (...styles) => {
  const removeCss = styles.map(style => style._insertCss())
  return () => removeCss.forEach(dispose => dispose())
}

i18next.on('loaded', () => {
  ReactDOM.render(
    <Router history={history}>
      <StyleContext.Provider value={{ insertCss }}>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <App />
          </Provider>
        </I18nextProvider>
      </StyleContext.Provider>
    </Router>,
    document.getElementById('root')
  )
})

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept()
  }
}
