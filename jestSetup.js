import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import browserEnv from 'browser-env'

browserEnv()
configure({ adapter: new Adapter() })

// window.someProperty = {
//   internalProp1: jest.fn()
//   internalProp2: jest.fn()
//   internalProp3: jest.fn()
// }
