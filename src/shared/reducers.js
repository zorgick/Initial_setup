import { combineReducers } from 'redux'
import appReducer from 'shared/containers/App/reducer'

/**
 * This function initializes reducer's dictionary and updates the latter with
 * new async reducers
 * @param {Object} [asyncReducers] Dictionary of async reducers
 * @returns {Object} New dictionary updated with async reducers
 */
export default function createReducer (asyncReducers) {
  return combineReducers({
    app: appReducer,
    ...asyncReducers
  })
}
