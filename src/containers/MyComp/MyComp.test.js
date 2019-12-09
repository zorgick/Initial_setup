import * as React from 'react'
import {MyComp} from './index'
import {shallowWrap, mountWrap, translateMock} from 'utils/testUtils'

describe('Testing MyComp container...', () => {
  let props
  const wrappedShallow = newProps =>
    shallowWrap(<MyComp {...props} {...newProps} />)

  const wrappedMount = newProps =>
    mountWrap(<MyComp {...props} {...newProps} />)

  beforeEach(() => {
    props = {
      secondHi: 'testHi',
      t: jest.fn(translateMock)
    }
  })

  test('should render MyComp container', () => {
    const wrapper = wrappedShallow()
    expect(wrapper).toMatchSnapshot()
  })
})
