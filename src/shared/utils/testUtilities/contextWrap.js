import { shallow, mount } from 'enzyme'
import createHistory from 'shared/utils/history'
import { shape } from 'prop-types'

const router = {
  history: createHistory(),
  route: {
    location: {},
    match: {}
  }
}

const createContext = () => ({
  context: { router },
  childContextTypes: { router: shape({}) }
})

export function mountWrap (node) {
  return mount(node, createContext())
}

export function shallowWrap (node) {
  return shallow(node, createContext())
}
