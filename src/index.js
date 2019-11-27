import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'core-js/es/promise' // Required for IE11 as webpack uses dynamic imports built on promises (import it explicitly in case of babel's useBuiltIns malfunction) [dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)

import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import App from 'containers/App'
import { Provider } from 'react-redux'

import history from 'utils/history'
import configureStore from './configureStore'
import './styles.css'

const store = configureStore()

const render = () =>
  ReactDOM.render(
    <Router history={history}>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>,
    document.getElementById('root')
  )

// IE10+ check
if (
  'fetch' in window &&
  'Intl' in window &&
  'Map' in window &&
  'Proxy' in window &&
  'forEach' in window.NodeList.prototype &&
  'startsWith' in String.prototype &&
  'endsWith' in String.prototype &&
  'includes' in String.prototype &&
  'includes' in Array.prototype &&
  'assign' in Object &&
  'entries' in Object &&
  'keys' in Object
) {
  render()
} else {
  import('utils/polyfills').then(render)
}
