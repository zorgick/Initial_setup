import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import App from 'containers/App'
import { Provider } from 'react-redux'

import history from 'utils/history'
import configureStore from './configureStore'
import './styles.css'

const store = configureStore()

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
)
