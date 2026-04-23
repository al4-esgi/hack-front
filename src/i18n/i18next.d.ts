import 'i18next'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      fr: {
        common: typeof import('../locales/fr/common.json')
        home: typeof import('../locales/fr/home.json')
        auth: typeof import('../locales/fr/auth.json')
        notFound: typeof import('../locales/fr/notFound.json')
        validation: typeof import('../locales/fr/validation.json')
        search: typeof import('../locales/fr/search.json')
      }
      en: {
        common: typeof import('../locales/en/common.json')
        home: typeof import('../locales/en/home.json')
        auth: typeof import('../locales/en/auth.json')
        notFound: typeof import('../locales/en/notFound.json')
        validation: typeof import('../locales/en/validation.json')
        search: typeof import('../locales/en/search.json')
      }
    }
  }
}