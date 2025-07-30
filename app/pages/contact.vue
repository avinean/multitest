<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {{ $t('contact.hero.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {{ $t('contact.hero.subtitle') }}
          </p>
          <div class="flex justify-center">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="w-16 h-16 text-blue-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="space-y-8">
        
        <!-- Contact Methods -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-10">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {{ $t('contact.info.title') }}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Email -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ $t('contact.info.email.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-300 mb-2">
                  {{ $t('contact.info.email.description') }}
                </p>
                <a 
                  href="mailto:prelecnaja@gmail.com" 
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  prelecnaja@gmail.com
                </a>
              </div>
            </div>

            <!-- Telegram -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <UIcon name="i-simple-icons-telegram" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ $t('contact.info.telegram.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-300 mb-2">
                  {{ $t('contact.info.telegram.description') }}
                </p>
                <a 
                  href="https://t.me/englistry" 
                  target="_blank"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  @englistry
                </a>
              </div>
            </div>

            <!-- Instagram -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                  <UIcon name="i-simple-icons-instagram" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ $t('contact.info.instagram.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-300 mb-2">
                  {{ $t('contact.info.instagram.description') }}
                </p>
                <a 
                  href="https://www.instagram.com/_marianna_english?igsh=dWdqemU1cjhidWF3" 
                  target="_blank"
                  class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium"
                >
                  @_marianna_english
                </a>
              </div>
            </div>

            <!-- Facebook -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <UIcon name="i-simple-icons-facebook" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ $t('contact.info.facebook.title') }}
                </h4>
                <p class="text-gray-600 dark:text-gray-300 mb-2">
                  {{ $t('contact.info.facebook.description') }}
                </p>
                <a 
                  href="https://www.facebook.com/share/1GBKgHbwQ5/" 
                  target="_blank"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  Facebook Page
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Response Time -->
        <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
          <div class="flex items-center space-x-3 mb-3">
            <UIcon name="i-heroicons-clock" class="w-6 h-6 text-green-600 dark:text-green-400" />
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t('contact.responseTime.title') }}
            </h4>
          </div>
          <p class="text-gray-700 dark:text-gray-300">
            {{ $t('contact.responseTime.description') }}
          </p>
        </div>

        <!-- FAQ Link -->
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
          <div class="flex items-center space-x-3 mb-3">
            <UIcon name="i-heroicons-question-mark-circle" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t('contact.faq.title') }}
            </h4>
          </div>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {{ $t('contact.faq.description') }}
          </p>
          <UButton
            :to="$localePath('/faq')"
            color="primary"
            variant="outline"
            size="sm"
          >
            {{ $t('contact.faq.button') }}
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
          </UButton>
        </div>
      </div>
    </div>

    <!-- Floating Contact Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-20"></div>
      <div class="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
      <div class="absolute bottom-40 left-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
      <div class="absolute bottom-20 right-10 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-25"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Contact Us',
  description: 'Get in touch with Englistry for support, questions, or feedback about our English learning platform.'
})

// SEO Meta
useHead({
  title: computed(() => $t('contact.meta.title')),
  meta: [
    { name: 'description', content: computed(() => $t('contact.meta.description')) },
    { name: 'keywords', content: 'contact, support, english learning, help, feedback' },
    { property: 'og:title', content: computed(() => $t('contact.meta.title')) },
    { property: 'og:description', content: computed(() => $t('contact.meta.description')) },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: computed(() => $t('contact.meta.title')) },
    { name: 'twitter:description', content: computed(() => $t('contact.meta.description')) }
  ]
})
</script> 