import { handleActions } from 'redux-actions'

export const initialState = {
  secondHi: 'Oh, hi, Mark!'
}

export default handleActions({}, initialState)
