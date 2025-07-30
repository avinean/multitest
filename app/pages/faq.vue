<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {{ $t('faq.hero.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {{ $t('faq.hero.subtitle') }}
          </p>
          <div class="flex justify-center">
            <UIcon name="i-heroicons-question-mark-circle" class="w-16 h-16 text-blue-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-12">
        <div class="flex items-center space-x-4">
          <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6 text-gray-400" />
          <UInput
            v-model="searchQuery"
            :placeholder="$t('faq.search.placeholder')"
            size="lg"
            class="flex-1"
          />
        </div>
      </div>

      <!-- FAQ Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'p-6 rounded-2xl border-2 transition-all duration-200 text-left',
            selectedCategory === category.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600'
          ]"
        >
          <UIcon :name="category.icon" class="w-8 h-8 text-primary-600 dark:text-primary-400 mb-3" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t(`faq.categories.${category.id}.title`) }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            {{ $t(`faq.categories.${category.id}.description`) }}
          </p>
        </button>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <div
          v-for="faq in filteredFAQs"
          :key="faq.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <button
            @click="toggleFAQ(faq.id)"
            class="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white pr-4">
              {{ $t(`faq.questions.${faq.id}.question`) }}
            </h3>
            <UIcon
              :name="openFAQs.includes(faq.id) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
              class="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
            />
          </button>
          <div
            v-if="openFAQs.includes(faq.id)"
            class="px-6 pb-6 border-t border-gray-100 dark:border-gray-700"
          >
            <div class="pt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ $t(`faq.questions.${faq.id}.answer`) }}
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredFAQs.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ $t('faq.noResults.title') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ $t('faq.noResults.description') }}
        </p>
        <UButton
          :to="$localePath('/contact')"
          color="primary"
          size="lg"
        >
          {{ $t('faq.noResults.contactButton') }}
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-2" />
        </UButton>
      </div>

      <!-- Contact CTA -->
      <div class="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center border border-primary-200 dark:border-primary-800">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('faq.contact.title') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          {{ $t('faq.contact.description') }}
        </p>
        <UButton
          :to="$localePath('/contact')"
          color="primary"
          size="lg"
        >
          {{ $t('faq.contact.button') }}
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
        </UButton>
      </div>
    </div>

    <!-- Floating Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-20"></div>
      <div class="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
      <div class="absolute bottom-40 left-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'FAQ - Frequently Asked Questions',
  description: 'Find answers to common questions about our English learning platform, tests, and features.'
})

// SEO Meta
useHead({
  title: computed(() => $t('faq.meta.title')),
  meta: [
    { name: 'description', content: computed(() => $t('faq.meta.description')) },
    { name: 'keywords', content: 'FAQ, help, questions, english learning, test, support, how to, english test help, proficiency test questions' },
    { name: 'author', content: computed(() => $t('site.name')) },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: computed(() => $t('faq.meta.title')) },
    { property: 'og:description', content: computed(() => $t('faq.meta.description')) },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: computed(() => $t('site.name')) },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: '@englistry' },
    { name: 'twitter:title', content: computed(() => $t('faq.meta.title')) },
    { name: 'twitter:description', content: computed(() => $t('faq.meta.description')) }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Englistry?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Englistry is a comprehensive English proficiency testing platform designed to assess your English language skills through various question types including reading comprehension, grammar, vocabulary, and cloze tests.'
            }
          },
          {
            '@type': 'Question',
            name: 'How long does the test take?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The test typically takes 30-45 minutes to complete, depending on the number of questions and your reading speed.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is the platform free to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, our basic English proficiency test is completely free to use. You can take the test multiple times and access your results without any cost.'
            }
          }
        ]
      })
    }
  ]
})

// i18n
const { t } = useI18n()

// State
const searchQuery = ref('')
const selectedCategory = ref('general')
const openFAQs = ref<string[]>([])

// Categories
const categories = [
  { id: 'general', icon: 'i-heroicons-information-circle' },
  { id: 'test', icon: 'i-heroicons-academic-cap' },
  { id: 'technical', icon: 'i-heroicons-computer-desktop' }
]

// FAQ Data
const faqs = [
  { id: 'what-is-englistry', category: 'general' },
  { id: 'how-to-start', category: 'general' },
  { id: 'is-free', category: 'general' },
  { id: 'test-duration', category: 'test' },
  { id: 'test-types', category: 'test' },
  { id: 'test-results', category: 'test' },
  { id: 'retake-test', category: 'test' },
  { id: 'browser-requirements', category: 'technical' },
  { id: 'mobile-support', category: 'technical' },
  { id: 'technical-issues', category: 'technical' }
]

// Computed
const filteredFAQs = computed(() => {
  let filtered = faqs

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(faq => faq.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(faq => {
      const question = t(`faq.questions.${faq.id}.question`).toLowerCase()
      const answer = t(`faq.questions.${faq.id}.answer`).toLowerCase()
      return question.includes(query) || answer.includes(query)
    })
  }

  return filtered
})

// Methods
const toggleFAQ = (id: string) => {
  const index = openFAQs.value.indexOf(id)
  if (index > -1) {
    openFAQs.value.splice(index, 1)
  } else {
    openFAQs.value.push(id)
  }
}

// Auto-open first FAQ on mount
onMounted(() => {
  if (filteredFAQs.value && filteredFAQs.value.length > 0) {
    openFAQs.value.push(filteredFAQs.value[0].id)
  }
})
</script> 