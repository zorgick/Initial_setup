import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import fetch from 'i18next-fetch-backend'

const { NODE_ENV, COMMIT } = process.env
const cacheKey = COMMIT.slice(0, 20)

const backendOpts = {
  loadPath: `http://localhost:7000/locales/{{lng}}/{{ns}}.json${
    cacheKey ? '?' + cacheKey : ''
  }`
}

i18n
  .use(fetch)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: backendOpts,
    debug: NODE_ENV === 'development' && true,
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
