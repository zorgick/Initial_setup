import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createReducer from './reducers'

/**
 * @typedef {Object} ReduxStore
 * @property {Object} [asyncReducers] Dictionary of dynamically added reducers
 * @property {function} dispatch Action emitter
 * @property {function} getState Returs actual state of the store
 * @property {Object} [liftedStore]
 * @property {function} replaceReducer Replaces the reducer currently used by
 * the store to calculate the state.
 * @property {function} subscribe Adds a change listener. It will be called
 * any time an action is dispatched, and some part of the state tree may
 * potentially have changed.
 * @property {Symbol} [Symbol.observable]
 */

const { NODE_ENV } = process.env

/**
 * This function sets up the initial redux store based on the initial state and middlewares
 * @param {Object} [initialState] Initial state of the app
 * @return {Object}
 */
function configureStore (initialState) {
  const middleware = [thunk]
  const devMiddlewares = []

  if (NODE_ENV === 'development') {
    const createLogger = require('redux-logger').createLogger // eslint-disable-line global-require
    devMiddlewares.push(createLogger())
  }

  const enhancers = applyMiddleware(...middleware, ...devMiddlewares)

  /**
   * @private
   * @type {ReduxStore}
   */
  const store = createStore(createReducer(), initialState, enhancers)

  // Add a dictionary to keep track of the registered async reducers
  store.asyncReducers = {}

  if (NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.asyncReducers))
    })
  }

  return store
}

export default configureStore()
