import { handleActions } from 'redux-actions'
import { updateGreetings } from './actions'

export const initialState = {
  hi: 'hello to marsians!'
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
