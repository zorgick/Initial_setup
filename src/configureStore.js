// @ts-nocheck
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createReducer from './reducers'

const { NODE_ENV } = process.env

export default function configureStore (initialState) {
  const middleware = [thunk]

  let createStoreWithMiddlewares
  if (NODE_ENV === 'development') {
    const createLogger = require('redux-logger').createLogger // eslint-disable-line global-require

    createStoreWithMiddlewares = compose(
      applyMiddleware(...middleware, createLogger()),
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )(createStore)
  } else {
    createStoreWithMiddlewares = applyMiddleware(...middleware)(createStore)
  }

  const store = createStoreWithMiddlewares(createReducer(), initialState)

  if (NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers))
    })
  }

  return store
}
