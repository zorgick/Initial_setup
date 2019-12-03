import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import App from 'containers/App'
import { Provider } from 'react-redux'

import history from 'utils/history'
import configureStore from './configureStore'
import { consoleProxy } from 'prod-console'
import './styles.css'

const { NODE_ENV } = process.env
const store = configureStore()

if (NODE_ENV === 'production') {
  const prodConsole = consoleProxy({ monitor: true })
  prodConsole.switchConsole('off')
}

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
)
