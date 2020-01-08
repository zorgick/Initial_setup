import * as React from 'react'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/withStyles'
import loadable from '@loadable/component'

import styles from './styles.css'

const NewComp = loadable(() =>
  import(
    /*  webpackChunkName: "my-comp" */
    'shared/containers/MyComp'
  )
)

const MainComp = loadable(() =>
  import(
    /*  webpackChunkName: "main-comp" */
    'shared/containers/MainComp'
  )
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
