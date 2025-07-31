<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div class="text-center">
          <div class="flex justify-center mb-6">
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <UIcon name="i-heroicons-rocket-launch" class="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {{ $t('release.hero.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {{ $t('release.hero.subtitle') }}
          </p>
          <div class="flex justify-center items-center gap-4 text-blue-200">
            <UIcon name="i-heroicons-calendar-days" class="w-5 h-5" />
            <span class="text-lg">{{ $t('release.lastUpdated') }}: </span>
            <NuxtTime :datetime="Date.now()" month="long" day="numeric" year="numeric" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"/>
          <p class="text-lg text-gray-600 dark:text-gray-300">{{ $t('common.loading') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <div class="text-red-500 dark:text-red-400 text-4xl mb-4">⚠️</div>
        <h2 class="text-xl font-bold text-red-800 dark:text-red-200 mb-2">{{ $t('common.error') }}</h2>
        <p class="text-red-600 dark:text-red-300">{{ error }}</p>
      </div>

      <!-- Release Timeline -->
      <div v-else-if="data && data.releases.length > 0" class="space-y-8">
        <div v-for="release in data.releases" :key="release.version" class="relative">
          <!-- Timeline line -->
          <div class="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          <!-- Release Card -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Release Header -->
            <div class="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center relative z-10">
                <UIcon name="i-heroicons-tag" class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ release.version }}</h3>
                  <UBadge 
                    :color="release.type === 'major' ? 'primary' : release.type === 'minor' ? 'success' : 'neutral'"
                    variant="solid"
                    class="text-xs"
                  >
                    {{ $t(`release.types.${release.type}`) }}
                  </UBadge>
                </div>
                <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
                    <NuxtTime :datetime="release.date" month="long" day="numeric" year="numeric" />
                  </div>
                  <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                    <NuxtTime :datetime="release.date" relative />
                  </div>
                </div>
              </div>
            </div>

            <!-- Release Content -->
            <div class="p-6">
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{{ release.description }}</p>
              
              <!-- Features -->
              <div class="space-y-6">
                <div v-if="release.features.length > 0">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-green-500" />
                    {{ $t('release.features') }}
                  </h4>
                  <ul class="space-y-2">
                    <li v-for="feature in release.features" :key="feature" class="flex items-start gap-3">
                      <div class="w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <UIcon name="i-heroicons-plus" class="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span class="text-gray-700 dark:text-gray-300">{{ feature }}</span>
                    </li>
                  </ul>
                </div>

                <div v-if="release.improvements.length > 0">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <UIcon name="i-heroicons-arrow-trending-up" class="w-5 h-5 text-blue-500" />
                    {{ $t('release.improvements') }}
                  </h4>
                  <ul class="space-y-2">
                    <li v-for="improvement in release.improvements" :key="improvement" class="flex items-start gap-3">
                      <div class="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <UIcon name="i-heroicons-arrow-up" class="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span class="text-gray-700 dark:text-gray-300">{{ improvement }}</span>
                    </li>
                  </ul>
                </div>

                <div v-if="release.fixes.length > 0">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-orange-500" />
                    {{ $t('release.bugFixes') }}
                  </h4>
                  <ul class="space-y-2">
                    <li v-for="fix in release.fixes" :key="fix" class="flex items-start gap-3">
                      <div class="w-5 h-5 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <UIcon name="i-heroicons-wrench" class="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span class="text-gray-700 dark:text-gray-300">{{ fix }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{{ $t('release.noReleases') }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('release.noReleasesMessage') }}</p>
      </div>

      <!-- Feedback Section -->
      <div class="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center border border-primary-200 dark:border-primary-800">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('release.feedback.title') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          {{ $t('release.feedback.description') }}
        </p>
        <UButton
          :to="$localePath('/contact')"
          color="primary"
          size="lg"
        >
          {{ $t('release.feedback.button') }}
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ReleasesData {
  releases: {
  version: string
  type: 'major' | 'minor' | 'patch'
  date: string
  description: string
  features: string[]
  improvements: string[]
  fixes: string[]
}[]
}

// SEO Meta
useHead({
  title: computed(() => $t('release.meta.title')),
  meta: [
    { name: 'description', content: computed(() => $t('release.meta.description')) },
    { name: 'keywords', content: 'release notes, updates, changelog, new features, bug fixes, improvements, NMT practice platform' },
    { name: 'author', content: computed(() => $t('site.name')) },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: computed(() => $t('release.meta.title')) },
    { property: 'og:description', content: computed(() => $t('release.meta.description')) },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: computed(() => $t('site.name')) },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@englistry' },
    { name: 'twitter:title', content: computed(() => $t('release.meta.title')) },
    { name: 'twitter:description', content: computed(() => $t('release.meta.description')) }
  ]
})

const { locale } = useI18n()

const { data, pending, error } = await useFetch<ReleasesData>(`/api/releases/${locale.value}`, {
  key: `releases-${locale.value}`
})
</script> 