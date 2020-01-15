import 'core-js/stable'
import 'regenerator-runtime/runtime'

import * as React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import App from 'containers/App'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { consoleProxy } from 'prod-console'
// import i18next from 'i18next'

import history from 'utils/history'
import i18n from 'utils/i18n.js'
import store from './configureStore'

import './styles.css'

const { NODE_ENV } = process.env

if (NODE_ENV === 'production') {
  const prodConsole = consoleProxy({ monitor: true })
  prodConsole.switchConsole('off')
}

ReactDOM.render(
  <Router history={history}>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <App />
      </Provider>
    </I18nextProvider>
  </Router>,
  document.getElementById('root')
)
// i18next.on('loaded', () => {
//   renderApp()
// })
