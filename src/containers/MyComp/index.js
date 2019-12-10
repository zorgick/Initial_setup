import * as React from 'react'
import * as PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { selectSecondGreetings } from './selectors'

export class MyComp extends React.PureComponent {
  render () {
    const { secondHi, t } = this.props
    return (
      <div>
        {t(`common.${secondHi}`)}
        <Link to='/'>{t('common.back')}</Link>
      </div>
    )
  }
}

MyComp.propTypes = {
  secondHi: PropTypes.string,
  t: PropTypes.func
}

const mapStateToProps = createStructuredSelector({
  secondHi: selectSecondGreetings
})

const withConnect = connect(mapStateToProps)

const withLanguage = withTranslation('common')

export default compose(
  withConnect,
  withLanguage
)(MyComp)
