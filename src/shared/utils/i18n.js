import fetch from 'isomorphic-fetch'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import i18nFetch from 'i18next-fetch-backend'

import { RU, EN } from 'shared/i18n/allTranslations'

const { NODE_ENV, COMMIT = '' } = process.env
const cacheKey = COMMIT.slice(0, 20)

const backendOpts = {
  loadPath: `/locales/{{lng}}/{{ns}}.json${cacheKey ? '?' + cacheKey : ''}`,
  fetch
}

if (__BROWSER__) {
  i18next.use(i18nFetch)
}

i18next.use(initReactI18next).init({
  backend: backendOpts,
  react: {
    useSuspense: false,
    wait: true,
    bindI18n: 'languageChanged loaded',
    bindStore: 'added removed',
    nsMode: 'default'
  },
  load: 'languageOnly',
  debug: NODE_ENV === 'development' && __BROWSER__,
  fallbackLng: 'ru',
  fallbackNS: ['translation'],
  // Load missing resources via i18next-fetch-backend
  partialBundledLanguages: true,
  resources: {
    ru: { translation: RU.translation },
    en: { translation: EN.translation }
  },
  interpolation: {
    escapeValue: false
  },
  parseMissingKeyHandler: missing => {
    if (NODE_ENV === 'development' && __BROWSER__) {
      console.warn('MISSING TRANSLATION:', missing)
    }
    return missing
  }
})
export default i18next
