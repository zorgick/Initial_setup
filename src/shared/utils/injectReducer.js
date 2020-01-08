import createReducer from 'shared/reducers'
import createInjectReducer from './createInjectReducer'

export default createInjectReducer(createReducer)
