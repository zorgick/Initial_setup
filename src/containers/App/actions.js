// import fetch from 'isomorphic-fetch'
import { createAction } from 'redux-actions'

export const updateGreetings = createAction('UPDATE_GREETING')

export const checkHandshake = () => async (dispatch, getState) => {
  dispatch(updateGreetings('Hi to earthians!'))
}
