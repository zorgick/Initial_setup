// import { createAction } from 'redux-actions'
import i18next from 'shared/utils/i18n'

export const setLocale = acceptedLng => async (dispatch, getState) => {
  const supportedLanguages = ['ru', 'en']

  let userLng
  if (acceptedLng && supportedLanguages.find(el => el === acceptedLng)) {
    userLng = acceptedLng
  } else {
    userLng = supportedLanguages[0]
  }
  i18next.changeLanguage(userLng)
}
