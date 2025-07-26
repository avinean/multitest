<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
    <div class="max-w-2xl mx-auto text-center">
      <!-- 404 Icon with Animation -->
      <div class="mb-8">
        <div class="relative inline-block">
          <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center animate-pulse">
            <UIcon 
              name="i-heroicons-map-pin" 
              class="w-16 h-16 text-blue-500 dark:text-blue-400"
            />
          </div>
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <!-- 404 Code -->
      <h1 class="text-8xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4 animate-pulse">
        404
      </h1>

      <!-- Error Message -->
      <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ $t('error.404.title') }}
      </h2>
      
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {{ $t('error.404.message') }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <UButton
          @click="navigateTo($localePath('/'))"
          size="lg"
          color="primary"
          variant="solid"
          class="min-w-[160px]"
        >
          <UIcon name="i-heroicons-home" class="w-5 h-5 mr-2" />
          {{ $t('error.goHome') }}
        </UButton>
      </div>

      <!-- Search Section -->
      <div class="mt-12 p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          {{ $t('error.404.searchTitle') }}
        </h3>
        <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <UInput
            v-model="searchQuery"
            :placeholder="$t('error.404.searchPlaceholder')"
            class="flex-1"
            @keyup.enter="handleSearch"
          />
          <UButton
            @click="handleSearch"
            color="primary"
            :disabled="!searchQuery.trim()"
          >
            <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 mr-1" />
            {{ $t('error.404.search') }}
          </UButton>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="mt-8 p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {{ $t('error.needHelp') }}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a 
            href="/blog" 
            class="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 group"
          >
            <UIcon name="i-heroicons-newspaper" class="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('error.browseBlog') }}</span>
          </a>
          <a 
            href="/test" 
            class="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 group"
          >
            <UIcon name="i-heroicons-academic-cap" class="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('error.takeTest') }}</span>
          </a>
          <a 
            href="/profile" 
            class="flex flex-col items-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 group"
          >
            <UIcon name="i-heroicons-user" class="w-8 h-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('error.viewProfile') }}</span>
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
const localePath = useLocalePath()
const searchQuery = ref('')

// SEO: Tell search engines to ignore 404 pages
useHead({
  title: $t('error.404.pageTitle'),
  meta: [
    { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
    { name: 'googlebot', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
    { property: 'og:robots', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
    { name: 'bingbot', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' }
  ]
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(localePath(`/blog?search=${encodeURIComponent(searchQuery.value.trim())}`))
  }
}
</script>

 