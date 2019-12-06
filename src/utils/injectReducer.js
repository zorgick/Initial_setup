import createReducer from '../reducers'
import { store } from '../index'

/**
 * This function adds the async reducer, and creates a new combined reducer
 * when a view is visible for a user
 * @param {string} key Name of the reducer of the module to be
 * injected in the store
 * @param {function} asyncReducer Reducer function
 * @returns {void} Creates a new combined reducer
 */
export default function injectReducer (key, asyncReducer) {
  store.asyncReducers[key] = asyncReducer
  store.replaceReducer(createReducer(store.asyncReducers))
}
