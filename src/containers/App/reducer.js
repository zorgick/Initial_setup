import { handleActions } from 'redux-actions'
import { updateGreetings } from './actions'

export const initialState = {
  hi: 'Hello to marsians'
}

export default handleActions(
  {
    [updateGreetings] (state, { payload }) {
      return {
        ...state,
        hi: payload
      }
    }
  },
  initialState
)
