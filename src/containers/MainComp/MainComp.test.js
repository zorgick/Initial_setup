import * as React from 'react'
import {MainComp} from './index'
import {shallowWrap, mountWrap, translateMock} from 'utils/testUtils'

describe('Testing MainComp container...', () => {
  let props

  const wrappedShallow = newProps =>
    shallowWrap(<MainComp {...props} {...newProps} />)

  const wrappedMount = newProps =>
    mountWrap(<MainComp {...props} {...newProps} />)

  beforeEach(() => {
    props = {
      loadGreetings: jest.fn(),
      hi: 'Hi from test',
      t: jest.fn(translateMock)
    }
  })

  test('should render MainComp container', () => {
    const wrapper = wrappedShallow()
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('h1').text()).toBe(props.hi)
  })

  test('should load new greetings from store on button click', () => {
    const wrapper = wrappedShallow()
    wrapper.find('button').simulate('click')
    expect(props.loadGreetings).toBeCalledTimes(1)
  })

  test('should update greetings when new "hi" prop is passed', () => {
    const wrapper = wrappedShallow()
    const hiBack = 'Hello to you, too'
    wrapper.setProps({hi: hiBack})
    expect(wrapper.find('h1').text()).toBe(hiBack)
  })
})
