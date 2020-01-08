import * as React from 'react'
import * as PropTypes from 'prop-types'
import { createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import injectReducer from 'shared/utils/injectReducer'
import { selectSecondGreetings } from './selectors'
import reducer from './reducer'

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
const withReducer = injectReducer({ key: 'my', reducer })

export default compose(withReducer, withConnect, withLanguage)(MyComp)
