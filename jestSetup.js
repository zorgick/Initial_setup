import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import browserEnv from 'browser-env'

browserEnv()
configure({ adapter: new Adapter() })

window.__BROWSER__ = false
