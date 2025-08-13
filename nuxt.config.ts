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
    '@nuxtjs/sitemap',
    '@nuxt/scripts',
    '@vite-pwa/nuxt'
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
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://englistry.com',
    gzip: true,
    exclude: [
      '/admin/**',
      '/profile/**',
      '/test/**',
      '/api/**',
      '/error/**',
      '/404',
      '/500',
      '/_**'
    ],
    defaults: {
      changefreq: 'daily',
      priority: 0.5,
      lastmod: new Date().toISOString()
    },
    // Enable automatic crawling for additional routes
    autoLastmod: true,
    // Cache sitemap for better performance
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    // Credits and attribution
    credits: false
  },
  fonts: {
    families: [
      {
        name: 'Exo 2',
        weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
      }
    ]
  },
  scripts: {
    registry: {
      // googleTagManager: {
      //   id: 'GTM-M6N6H6JF'
      // },
      // googleAdsense: {
      //   client: 'ca-pub-1071790834150767',
      //   autoAds: true
      // }
    }
  },
  runtimeConfig: {
    public: {
      monoKey: process.env.NUXT_PUBLIC_MONO_KEY,
      monoUrl: process.env.NUXT_PUBLIC_MONO_URL
    }
  }
})