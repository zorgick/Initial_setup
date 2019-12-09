import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import XHR from 'i18next-xhr-backend'

import * as translationEN from '../public/locales/en/translation.json'
import * as translationRU from '../public/locales/ru/translation.json'

const { NODE_ENV } = process.env

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  ru: {
    translation: translationRU
  }
}

// const backendOpts = {
//   loadPath: `${process.env.cwd}/{{lng}}/{{ns}}.json`
// }

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
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
