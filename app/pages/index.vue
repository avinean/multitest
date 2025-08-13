<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-blue-600 text-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div class="text-center">
          <div class="mb-8 opacity-0 animate-[fadeInDown_0.8s_ease-out_forwards]">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 animate-bounce">
              <UIcon name="i-heroicons-academic-cap" class="w-10 h-10 text-blue-200" />
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
            {{ $t('home.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
            {{ $t('home.subtitle') }}
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
            <UButton 
              size="xl" 
              class="px-8 py-4 text-lg font-semibold bg-white text-primary-600 hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              :to="$localePath('/test')"
            >
              <UIcon name="i-heroicons-play" class="w-6 h-6 mr-2 animate-pulse" />
              {{ $t('home.startTest') }}
            </UButton>
            <UButton 
              size="xl" 
              variant="outline"
              class="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
              :to="$localePath('/faq')"
            >
              <UIcon name="i-heroicons-question-mark-circle" class="w-6 h-6 mr-2" />
              {{ $t('home.learnMore') }}
            </UButton>
          </div>

          <!-- Test Info -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto border border-white/20 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.6s_forwards] hover:bg-white/15">
            <div class="flex items-center justify-center">
              <UIcon name="i-heroicons-clock" class="w-5 h-5 mr-2 text-blue-200 animate-pulse" />
              <span class="text-blue-100 font-medium">{{ $t('home.testInfo') }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 border border-white rounded-full animate-[spin_20s_linear_infinite]"></div>
        <div class="absolute top-40 right-20 w-20 h-20 border border-white rounded-full animate-[spin_20s_linear_infinite_1s]"></div>
        <div class="absolute bottom-20 left-20 w-24 h-24 border border-white rounded-full animate-[spin_20s_linear_infinite_2s]"></div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div class="text-center mb-16 opacity-0 transition-all duration-800" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': featuresVisible }" ref="featuresSection">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {{ $t('home.features.title') }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {{ $t('home.features.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <!-- Reading Comprehension -->
        <div class="group opacity-0 transition-all duration-800 delay-200" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': featuresVisible }">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-heroicons-book-open" class="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {{ $t('home.features.reading.title') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
              {{ $t('home.features.reading.description') }}
            </p>
          </div>
        </div>

        <!-- Grammar & Vocabulary -->
        <div class="group opacity-0 transition-all duration-800 delay-400" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': featuresVisible }">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-heroicons-pencil-square" class="w-8 h-8 text-green-600 dark:text-green-400 group-hover:animate-bounce" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {{ $t('home.features.grammar.title') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
              {{ $t('home.features.grammar.description') }}
            </p>
          </div>
        </div>

        <!-- Cloze Tests -->
        <div class="group opacity-0 transition-all duration-800 delay-600" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': featuresVisible }">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 h-full transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:-translate-y-2">
            <div class="text-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-heroicons-puzzle-piece" class="w-8 h-8 text-purple-600 dark:text-purple-400 group-hover:animate-bounce" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {{ $t('home.features.cloze.title') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
              {{ $t('home.features.cloze.description') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-8 mb-16 border border-primary-200 dark:border-primary-800 opacity-0 transition-all duration-800 hover:shadow-xl" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': statsVisible }" ref="statsSection">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="opacity-0 transition-all duration-600" :class="{ 'opacity-100 animate-[countUp_0.6s_ease-out_forwards]': statsVisible }">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {{ $t('home.stats.questions') }}
            </div>
            <div class="text-gray-600 dark:text-gray-300 font-medium">
              {{ $t('home.stats.questionsLabel') }}
            </div>
          </div>
          <div class="opacity-0 transition-all duration-600 delay-200" :class="{ 'opacity-100 animate-[countUp_0.6s_ease-out_forwards]': statsVisible }">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {{ $t('home.stats.time') }}
            </div>
            <div class="text-gray-600 dark:text-gray-300 font-medium">
              {{ $t('home.stats.timeLabel') }}
            </div>
          </div>
          <div class="opacity-0 transition-all duration-600 delay-400" :class="{ 'opacity-100 animate-[countUp_0.6s_ease-out_forwards]': statsVisible }">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {{ $t('home.stats.accuracy') }}
            </div>
            <div class="text-gray-600 dark:text-gray-300 font-medium">
              {{ $t('home.stats.accuracyLabel') }}
            </div>
          </div>
          <div class="opacity-0 transition-all duration-600 delay-600" :class="{ 'opacity-100 animate-[countUp_0.6s_ease-out_forwards]': statsVisible }">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {{ $t('home.stats.free') }}
            </div>
            <div class="text-gray-600 dark:text-gray-300 font-medium">
              {{ $t('home.stats.freeLabel') }}
            </div>
          </div>
        </div>
      </div>

      <!-- How It Works -->
      <div class="text-center mb-16 opacity-0 transition-all duration-800" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': howItWorksVisible }" ref="howItWorksSection">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {{ $t('home.howItWorks.title') }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
          {{ $t('home.howItWorks.subtitle') }}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center opacity-0 transition-all duration-800 delay-200" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': howItWorksVisible }">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold hover:scale-110 transition-transform duration-300 animate-pulse">
              1
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {{ $t('home.howItWorks.step1.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ $t('home.howItWorks.step1.description') }}
            </p>
          </div>
          <div class="text-center opacity-0 transition-all duration-800 delay-400" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': howItWorksVisible }">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold hover:scale-110 transition-transform duration-300 animate-pulse">
              2
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {{ $t('home.howItWorks.step2.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ $t('home.howItWorks.step2.description') }}
            </p>
          </div>
          <div class="text-center opacity-0 transition-all duration-800 delay-600" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': howItWorksVisible }">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold hover:scale-110 transition-transform duration-300 animate-pulse">
              3
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {{ $t('home.howItWorks.step3.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ $t('home.howItWorks.step3.description') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Final CTA -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12 text-center opacity-0 transition-all duration-800 hover:shadow-2xl" :class="{ 'opacity-100 animate-[fadeInUp_0.8s_ease-out_forwards]': ctaVisible }" ref="ctaSection">
        <UIcon name="i-heroicons-rocket-launch" class="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-6 animate-bounce" />
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {{ $t('home.cta.title') }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          {{ $t('home.cta.subtitle') }}
        </p>
        <UButton 
          size="xl" 
          class="px-12 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          color="primary"
          :to="$localePath('/test')"
        >
          <UIcon name="i-heroicons-play" class="w-6 h-6 mr-2 animate-pulse" />
          {{ $t('home.startTest') }}
        </UButton>
      </div>
    </div>

    <!-- Floating Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-20"></div>
      <div class="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
      <div class="absolute bottom-40 left-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
      <div class="absolute bottom-20 right-10 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-25"></div>
      <div class="absolute top-1/2 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
      <div class="absolute top-1/3 right-1/3 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-35"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Reactive refs for intersection observer
const featuresVisible = ref(false)
const statsVisible = ref(false)
const howItWorksVisible = ref(false)
const ctaVisible = ref(false)

// Template refs
const featuresSection = ref<HTMLElement>()
const statsSection = ref<HTMLElement>()
const howItWorksSection = ref<HTMLElement>()
const ctaSection = ref<HTMLElement>()

// Intersection Observer setup
let observer: IntersectionObserver | null = null

onMounted(() => {
  // Create intersection observer for 80% visibility threshold
  const observerOptions = {
    threshold: 0.4,
    rootMargin: '0px 0px -10% 0px'
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Determine which section is being observed
        if (entry.target === featuresSection.value) {
          featuresVisible.value = true
        } else if (entry.target === statsSection.value) {
          statsVisible.value = true
        } else if (entry.target === howItWorksSection.value) {
          howItWorksVisible.value = true
        } else if (entry.target === ctaSection.value) {
          ctaVisible.value = true
        }
      }
    })
  }, observerOptions)

  // Observe sections
  if (featuresSection.value) observer.observe(featuresSection.value)
  if (statsSection.value) observer.observe(statsSection.value)
  if (howItWorksSection.value) observer.observe(howItWorksSection.value)
  if (ctaSection.value) observer.observe(ctaSection.value)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// SEO Meta
useHead({
  title: computed(() => $t('home.meta.title')),
  meta: [
    { name: 'description', content: computed(() => $t('home.meta.description')) },
    { name: 'keywords', content: 'english test, proficiency test, grammar, vocabulary, reading comprehension, free english test, english assessment, language test' },
    { name: 'author', content: computed(() => $t('site.name')) },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: computed(() => $t('home.meta.title')) },
    { property: 'og:description', content: computed(() => $t('home.meta.description')) },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: computed(() => $t('site.name')) },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@englistry' },
    { name: 'twitter:title', content: computed(() => $t('home.meta.title')) },
    { name: 'twitter:description', content: computed(() => $t('home.meta.description')) }
  ],
  link: [
    { rel: 'canonical', href: computed(() => $t('site.url')) }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: $t('site.name'),
        description: $t('site.description'),
        url: $t('site.url'),
        publisher: {
          '@type': 'Organization',
          name: $t('site.name'),
          url: $t('site.url')
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${$t('site.url')}/blog?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }))
    }
  ]
})
</script> 