import * as React from 'react'
// import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import loadable from '@loadable/component'
import injectReducer from 'utils/injectReducer'

const NewComp = loadable(() =>
  import(/*  webpackChunkName: "my-comp" */ 'containers/MyComp/reducer').then(
    module => {
      injectReducer('my', module.default)

      return import(
        /*  webpackChunkName: "my-comp" */
        'containers/MyComp'
      )
    }
  )
)

const MainComp = loadable(() =>
  import(
    /*  webpackChunkName: "main-comp" */ 'containers/MainComp/reducer'
  ).then(module => {
    injectReducer('main', module.default)

    return import(
      /*  webpackChunkName: "main-comp" */
      'containers/MainComp'
    )
  })
)

export class App extends React.PureComponent {
  render () {
    return (
      <Switch>
        <Route exact path='/' component={MainComp} />
        <Route exact path='/app' component={NewComp} />
      </Switch>
    )
  }
}

App.propTypes = {}

const mapStateToProps = createStructuredSelector({})

function mapDispatchToProps (dispatch) {
  return {}
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(withConnect)(App)
