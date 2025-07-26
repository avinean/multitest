// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-18',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    'nuxt-vuefire',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxtjs/sitemap'
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light'
  },
  routeRules: {
    // '/**': { redirect: '/en' },
    '/:locale/admin/**': { ssr: false },
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
      // optimizeTranslationDirective: false
    }
  },
  sitemap: {
    siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://englistry.com',
    exclude: [
      '/admin/**',
      '/profile/**',
      '/test/**',
      '/api/**'
    ]
  },
  fonts: {
    families: [
      {
        name: 'Exo 2',
        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
      }
    ]
  }
})