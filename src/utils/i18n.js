import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import fetch from 'i18next-fetch-backend'

import * as translationEN from '../public/locales/en/translation.json'
import * as commonEN from '../public/locales/en/common.json'
import * as translationRU from '../public/locales/ru/translation.json'
import * as commonRU from '../public/locales/ru/common.json'

const { NODE_ENV } = process.env

// the translations
const resources = {
  en: {
    translation: translationEN,
    common: commonEN
  },
  ru: {
    translation: translationRU,
    common: commonRU
  }
}

// const backendOpts = {
//   loadPath: 'http://localhost:3080/initial-setup/public/locales/{{lng}}/{{ns}}.json'
// }

i18n
  .use(fetch)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // backend: backendOpts,
    debug: NODE_ENV === 'development' && true,
    fallbackLng: 'en',
    load: 'languageOnly',
    resources,
    react: {
      wait: false,
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n
