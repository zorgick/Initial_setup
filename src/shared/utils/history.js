import { createBrowserHistory, createMemoryHistory } from 'history'

export const createHistory = ({ initialEntries = [] } = {}) =>
  __BROWSER__ ? createBrowserHistory() : createMemoryHistory({ initialEntries })

export default createHistory
