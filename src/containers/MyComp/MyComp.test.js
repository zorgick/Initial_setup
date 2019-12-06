import React from 'react'
import {MyComp} from './index'
import {shallowWrap, mountWrap} from 'utils/contextWrap'

describe('Testing MyComp container...', () => {
  let props
  const wrappedShallow = newProps =>
    shallowWrap(<MyComp {...props} {...newProps} />)

  const wrappedMount = newProps =>
    mountWrap(<MyComp {...props} {...newProps} />)

  beforeEach(() => {
    props = {}
  })

  test('should render MyComp container', () => {
    const wrapper = wrappedShallow()
    expect(wrapper).toMatchSnapshot()
  })
})
