// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-18',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    'nuxt-vuefire',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light'
  },
  routeRules: {
    '/:locale/admin/**': { ssr: false },
    '/:locale': { prerender: true },
    '/:locale/blog/**': { prerender: true },
    '/:locale/test/**': { ssr: false },
    '/:locale/profile/**': { ssr: false }
  },
  vuefire: {
    config: {
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
    }
  },
  typescript: {
    strict: true
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'uk',
        iso: 'uk-UA',
        name: 'Українська',
        file: 'uk.json'
      }
    ],
    lazy: true,
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    bundle: {
      optimizeTranslationDirective: false
    }
  }
})