import fetch from 'isomorphic-fetch'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import i18nFetch from 'i18next-fetch-backend'

const { NODE_ENV, COMMIT = '' } = process.env
const cacheKey = COMMIT.slice(0, 20)

const backendOpts = {
  loadPath: `http://localhost:8070/locales/{{lng}}/{{ns}}.json${
    cacheKey ? '?' + cacheKey : ''
  }`,
  fetch
}

// https://github.com/i18next/react-i18next/issues/715#issuecomment-506860398
i18n
  .use(i18nFetch)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: backendOpts,
    debug: NODE_ENV === 'development' && __BROWSER__,
    fallbackLng: 'ru',
    load: 'languageOnly',
    react: {
      wait: true,
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
