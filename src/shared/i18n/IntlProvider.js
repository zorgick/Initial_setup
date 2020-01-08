import * as React from 'react'
import * as PropTypes from 'prop-types'
import { I18nextProvider } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { setLocale } from 'shared/containers/App/actions'
import i18next from 'shared/utils/i18n'

class IntlProvider extends React.Component {
  constructor (props) {
    super(props)
    const { acceptedLng, tuneI18next } = this.props
    tuneI18next(acceptedLng)
  }

  render () {
    return (
      <I18nextProvider i18n={i18next}>{this.props.children}</I18nextProvider>
    )
  }
}

IntlProvider.propTypes = {
  children: PropTypes.node,
  acceptedLng: PropTypes.string,
  tuneI18next: PropTypes.func
}

function mapDispatchToProps (dispatch) {
  return {
    tuneI18next: lng => dispatch(setLocale(lng))
  }
}

const withConnect = connect(undefined, mapDispatchToProps)

export default compose(withConnect)(IntlProvider)
