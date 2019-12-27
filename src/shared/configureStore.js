import createStoreManager from 'shared/utils/Proxies/createStoreManager'

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

/**
 * This function sets up the initial redux store based on the initial state and middlewares
 * @param {Object} [initialState] Initial state of the app
 * @return {Object}
 */
function configureStore (initialState) {
  /**
   * @private
   * @type {ReduxStore}
   */
  this.store = this.createStoreWithMiddlewares(initialState)

  // Add a dictionary to keep track of the registered async reducers
  this.store.asyncReducers = {}

  return this.store
}

export default createStoreManager(configureStore)
