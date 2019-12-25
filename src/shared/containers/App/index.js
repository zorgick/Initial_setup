import * as React from 'react'
// import PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/withStyles'
import loadable from '@loadable/component'

import injectReducer from 'shared/utils/injectReducer'
import styles from './styles.css'

const NewComp = loadable(() =>
  import(
    /*  webpackChunkName: "my-comp" */ 'shared/containers/MyComp/reducer'
  ).then(module => {
    injectReducer('my', module.default)

    return import(
      /*  webpackChunkName: "my-comp" */
      'shared/containers/MyComp'
    )
  })
)

const MainComp = loadable(() =>
  import(
    /*  webpackChunkName: "main-comp" */ 'shared/containers/MainComp/reducer'
  ).then(module => {
    injectReducer('main', module.default)

    return import(
      /*  webpackChunkName: "main-comp" */
      'shared/containers/MainComp'
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

const withConnect = connect(mapStateToProps, mapDispatchToProps)
// @ts-ignore
export default compose(withConnect, withStyles(styles))(App)
