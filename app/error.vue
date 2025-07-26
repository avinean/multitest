<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
    <div class="max-w-2xl mx-auto text-center">
      <!-- Error Icon with Animation -->
      <div class="mb-8">
        <div class="relative inline-block">
          <div class="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center animate-pulse">
            <UIcon 
              :name="errorIcon" 
              class="w-16 h-16 text-red-500 dark:text-red-400"
            />
          </div>
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <!-- Error Code -->
      <h1 class="text-8xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-4 animate-pulse">
        {{ error.statusCode || '404' }}
      </h1>

      <!-- Error Message -->
      <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ errorTitle }}
      </h2>
      
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {{ errorMessage }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <UButton
          @click="handleGoHome"
          size="lg"
          color="primary"
          variant="solid"
          class="min-w-[160px]"
        >
          <UIcon name="i-heroicons-home" class="w-5 h-5 mr-2" />
          {{ $t('error.goHome') }}
        </UButton>
        
        <UButton
          @click="handleGoBack"
          size="lg"
          color="neutral"
          variant="outline"
          class="min-w-[160px]"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 mr-2" />
          {{ $t('error.goBack') }}
        </UButton>
      </div>

      <!-- Additional Help -->
      <div class="mt-12 p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {{ $t('error.needHelp') }}
        </h3>
        <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <a 
            href="/blog" 
            class="flex items-center hover:text-primary-500 transition-colors"
          >
            <UIcon name="i-heroicons-newspaper" class="w-4 h-4 mr-1" />
            {{ $t('error.browseBlog') }}
          </a>
          <a 
            href="/test" 
            class="flex items-center hover:text-primary-500 transition-colors"
          >
            <UIcon name="i-heroicons-academic-cap" class="w-4 h-4 mr-1" />
            {{ $t('error.takeTest') }}
          </a>
          <a 
            href="/profile" 
            class="flex items-center hover:text-primary-500 transition-colors"
          >
            <UIcon name="i-heroicons-user" class="w-4 h-4 mr-1" />
            {{ $t('error.viewProfile') }}
          </a>
        </div>
      </div>

      <!-- Floating Elements for Visual Appeal -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-20"></div>
        <div class="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
        <div class="absolute bottom-40 left-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
        <div class="absolute bottom-20 right-10 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-25"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}

const props = defineProps<ErrorProps>()

// SEO: Tell search engines to ignore error pages
useHead({
  title: computed(() => {
    const statusCode = props.error.statusCode
    if (statusCode === 404) return $t('error.404.pageTitle')
    if (statusCode === 403) return $t('error.403.pageTitle')
    if (statusCode === 500) return $t('error.500.pageTitle')
    if (statusCode === 503) return $t('error.503.pageTitle')
    return $t('error.generic.pageTitle')
  }),
  meta: [
    { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
    { name: 'googlebot', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
    { property: 'og:robots', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
    { name: 'bingbot', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' }
  ]
})

// Computed properties for dynamic content
const errorIcon = computed(() => {
  const statusCode = props.error.statusCode
  if (statusCode === 404) return 'i-heroicons-map-pin'
  if (statusCode === 403) return 'i-heroicons-shield-exclamation'
  if (statusCode === 500) return 'i-heroicons-server'
  if (statusCode === 503) return 'i-heroicons-wrench-screwdriver'
  return 'i-heroicons-exclamation-triangle'
})

const errorTitle = computed(() => {
  const statusCode = props.error.statusCode
  if (statusCode === 404) return $t('error.404.title')
  if (statusCode === 403) return $t('error.403.title')
  if (statusCode === 500) return $t('error.500.title')
  if (statusCode === 503) return $t('error.503.title')
  return $t('error.generic.title')
})

const errorMessage = computed(() => {
  const statusCode = props.error.statusCode
  if (statusCode === 404) return $t('error.404.message')
  if (statusCode === 403) return $t('error.403.message')
  if (statusCode === 500) return $t('error.500.message')
  if (statusCode === 503) return $t('error.503.message')
  return $t('error.generic.message')
})

// Navigation handlers
const handleGoHome = () => {
  clearError()
  navigateTo('/')
}

const handleGoBack = () => {
  clearError()
  if (process.client) {
    window.history.back()
  }
}

// Auto-redirect for certain errors
onMounted(() => {
  const statusCode = props.error.statusCode
  if (statusCode === 404) {
    // Log 404 errors for analytics
    console.warn('404 Error:', window.location.pathname)
  }
})
</script>

 