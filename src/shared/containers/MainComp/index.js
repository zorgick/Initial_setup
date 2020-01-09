import * as React from 'react'
import * as PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { Helmet } from 'react-helmet-async'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import withStyles from 'isomorphic-style-loader/withStyles'

import injectReducer from 'shared/utils/injectReducer'
import { selectGreetings } from './selectors'
import { checkHandshake } from './actions'
import reducer from './reducer'

import styles from './styles.css'

export class MainComp extends React.PureComponent {
  handleHandshake = () => {
    this.props.loadGreetings()
  }

  render () {
    const { t, hi } = this.props

    return (
      <div>
        <Helmet defaultTitle='Main-Component | Ensemble' />
        <h1 className={styles.earlyDawn}>{t(`common.${hi}`)}</h1>
        <button onClick={this.handleHandshake}>{t('common.handshake')}</button>
        <Link to='/app'>{t('common.link')}</Link>
      </div>
    )
  }
}

MainComp.propTypes = {
  hi: PropTypes.string,
  loadGreetings: PropTypes.func,
  t: PropTypes.func
}

const mapStateToProps = createStructuredSelector({
  hi: selectGreetings
})

function mapDispatchToProps (dispatch) {
  return {
    loadGreetings: () => dispatch(checkHandshake())
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps)
const withLanguage = withTranslation()
const withReducer = injectReducer({ key: 'main', reducer })

export default compose(
  withStyles(styles),
  withReducer,
  withConnect,
  withLanguage
)(MainComp)
