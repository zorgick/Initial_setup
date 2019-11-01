import React from 'react'
import {App} from './index'
import {shallowWrap, mountWrap} from 'utils/contextWrap'

describe('Testing App container...', () => {
  let props
  const wrappedShallow = newProps =>
    shallowWrap(<App {...props} {...newProps} />)

  const wrappedMount = newProps => mountWrap(<App {...props} {...newProps} />)

  beforeEach(() => {
    props = {
      loadGreetings: jest.fn(),
      hi: 'Hi from test'
    }
  })

  test('should render App container', () => {
    const wrapper = wrappedShallow()
    expect(wrapper).toMatchSnapshot()
  })

  test('should handle click on the button', () => {})
})
