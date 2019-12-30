import * as React from 'react'
import {App} from './index'
import {shallowWrap, mountWrap} from 'shared/utils/testUtils'

describe('Testing App container...', () => {
  let props
  const wrappedShallow = newProps =>
    shallowWrap(<App {...props} {...newProps} />)

  const wrappedMount = newProps => mountWrap(<App {...props} {...newProps} />)

  beforeEach(() => {
    props = {}
  })

  test('should render App container', () => {
    const wrapper = wrappedShallow()
    expect(wrapper).toMatchSnapshot()
  })
})
