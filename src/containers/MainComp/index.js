import * as React from 'react'
import * as PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { selectGreetings } from './selectors'
import { checkHandshake } from './actions'

import styles from './styles.css'

export function MainComp ({ loadGreetings, hi }) {
  const initiateHandshake = () => {
    loadGreetings()
  }

  return (
    <div>
      <h1 className={styles.earlyDawn}>{hi}</h1>
      <button onClick={initiateHandshake}>Handshake</button>
      <Link to='/app'>click</Link>
    </div>
  )
}

MainComp.propTypes = {
  hi: PropTypes.string,
  loadGreetings: PropTypes.func
}

const mapStateToProps = createStructuredSelector({
  hi: selectGreetings
})

function mapDispatchToProps (dispatch) {
  return {
    loadGreetings: () => dispatch(checkHandshake())
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(withConnect)(MainComp)
