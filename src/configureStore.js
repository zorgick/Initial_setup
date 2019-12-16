// @ts-nocheck
import { createStore, applyMiddleware, compose } from 'redux'
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

  let createStoreWithMiddlewares
  if (NODE_ENV === 'development') {
    const createLogger = require('redux-logger').createLogger // eslint-disable-line global-require
    const reduxImmutableStateInvariant = require('redux-immutable-state-invariant')
      .default // eslint-disable-line global-require

    createStoreWithMiddlewares = compose(
      applyMiddleware(
        ...middleware,
        createLogger(),
        /**
         * reduxImmutableStateInvariant spits an error when you
         * try to mutate your state either inside a dispatch or
         * between dispatches
         */
        reduxImmutableStateInvariant()
      ),
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )(createStore)
  } else {
    createStoreWithMiddlewares = applyMiddleware(...middleware)(createStore)
  }

  /**
   * @private
   * @type {ReduxStore}
   */
  const store = createStoreWithMiddlewares(createReducer(), initialState)

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
