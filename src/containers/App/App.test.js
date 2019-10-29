import React from 'react'
import {App} from './index'
import {shallow, mount} from 'enzyme'

describe('Testing App container...', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<App loadGreetings={() => {}} hi="Hi from test" />)
  })

  test('should render App container', () => {
    expect(wrapper).toMatchSnapshot()
  })

  test('should handle click on the button', () => {
    console.log(wrapper.props())
  })
})
