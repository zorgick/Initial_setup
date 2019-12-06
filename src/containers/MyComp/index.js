import React from 'react'
import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { selectSecondGreetings } from './selectors'

export function MyComp ({ secondHi }) {
  return (
    <div>
      {secondHi}
      <Link to='/'>back</Link>
    </div>
  )
}

MyComp.propTypes = {
  secondHi: PropTypes.string
}

const mapStateToProps = createStructuredSelector({
  secondHi: selectSecondGreetings
})

const withConnect = connect(mapStateToProps)

export default compose(withConnect)(MyComp)
