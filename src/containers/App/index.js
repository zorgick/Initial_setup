import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { checkHandshake } from './actions'
import { selectGreetings } from './selectors'

export class App extends PureComponent {
  initiateHandshake = () => {
    const { loadGreetings } = this.props
    loadGreetings()
  }

  render () {
    const { hi } = this.props
    return (
      <section>
        <h1>{hi}</h1>
        <button onClick={this.initiateHandshake}>Handshake</button>
      </section>
    )
  }
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

export default compose(withConnect)(App)
