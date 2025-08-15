<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative mx-auto py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
            {{ t('subscriptions.hero.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {{ t('subscriptions.hero.subtitle') }}
          </p>
        </div>
      </div>
      
      <!-- Floating Elements -->
      <div class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
      <div class="absolute top-20 right-20 w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
      <div class="absolute bottom-20 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-bounce"></div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="mx-auto py-20">
      <div class="text-center mb-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('subscriptions.loading.title') }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300">
          {{ t('subscriptions.loading.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mx-auto py-20">
      <div class="text-center">
        <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
          <div class="flex justify-center mb-4">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500" />
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">
            {{ t('subscriptions.error.title') }}
          </h3>
          <p class="text-red-700 mb-4">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Pricing Plans Section -->
    <div v-else-if="data && data.length > 0" class="mx-auto py-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('subscriptions.pricing.title') }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {{ t('subscriptions.pricing.subtitle') }}
        </p>
      </div>

      <div class="flex gap-4 px-2 py-20 md:px-20 overflow-auto items-stretch">
        <div 
          v-for="item in data"
          :key="item.id"
          class="relative basis-[360px] shrink-0 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          :class="{
            'bg-gradient-to-br from-purple-500 to-pink-600 border-2 border-purple-400': item.badge === 'popular'
          }"
        >
          <!-- Popular Badge -->
          <div v-if="item.badge === 'popular'" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              {{ t('subscriptions.plans.popular.badge') }}
            </span>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
                 :class="{
                   'from-purple-400 to-pink-500': item.badge === 'popular',
                   'from-indigo-500 to-purple-600': item.badge === 'pro',
                   'from-yellow-500 to-orange-600': item.badge === 'premium'
                 }">
              <UIcon 
                :name="getPlanIcon(item)" 
                class="w-8 h-8 text-white" 
              />
            </div>
            <h3 class="text-2xl font-bold mb-2"
                :class="{
                  'text-white': item.badge === 'popular',
                  'text-gray-900 dark:text-white': item.badge !== 'popular'
                }">
              {{ item[locale]?.title }}
            </h3>
            <div class="text-4xl font-bold mb-2"
                 :class="{
                   'text-white': item.badge === 'popular',
                   'text-gray-900 dark:text-white': item.badge !== 'popular'
                 }">
              {{ item.price }}
            </div>
            <p class="mb-8"
               :class="{
                 'text-purple-100': item.badge === 'popular',
                 'text-gray-600 dark:text-gray-400': item.badge !== 'popular'
               }">
              {{ item[locale]?.description }}
            </p>
          </div>

          <ul class="grow-1 space-y-4 mb-8">
            <li v-for="feature in item[locale]?.features " :key="feature" class="flex items-center">
              <UIcon 
                name="i-heroicons-check-circle" 
                class="w-5 h-5 mr-3 flex-shrink-0"
                :class="{
                  'text-green-300': item.badge === 'popular',
                  'text-green-500': item.badge !== 'popular'
                }" 
              />
              <span :class="{
                'text-white': item.badge === 'popular',
                'text-gray-700 dark:text-gray-300': item.badge !== 'popular'
              }">{{ feature }}</span>
            </li>
          </ul>

          <UButton
            @click="showContactModal = true"
            class="w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            :class="getButtonClasses(item)"
          >
            {{ getCTAText(item) }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- No Subscriptions State -->
    <div v-else class="mx-auto py-20">
      <div class="text-center">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
          <UIcon name="i-heroicons-information-circle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ t('subscriptions.noSubscriptions.title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ t('subscriptions.noSubscriptions.message') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <ModalContact v-model:open="showContactModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { collection, query, where, orderBy } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

const { t, locale } = useI18n()

// Meta tags
useHead({
  title: computed(() => t('subscriptions.meta.title')),
  meta: [
    { name: 'description', content: computed(() => t('subscriptions.meta.description')) },
    { name: 'author', content: computed(() => t('site.name')) },
    { property: 'og:title', content: computed(() => t('subscriptions.meta.title')) },
    { property: 'og:description', content: computed(() => t('subscriptions.meta.description')) },
    { property: 'og:site_name', content: computed(() => t('site.name')) },
    { name: 'twitter:title', content: computed(() => t('subscriptions.meta.title')) },
    { name: 'twitter:description', content: computed(() => t('subscriptions.meta.description')) }
  ]
})

const db = useFirestore()
const showContactModal = ref(false)

const { data, pending, error } = useCollection<Subscription>(query(
  collection(db, 'subscriptions'),
  where('published', '==', true),
  orderBy('price', 'asc')
))

// Helper function to get plan icon based on badge
const getPlanIcon = (subscription: any) => {
  switch (subscription.badge) {
    case 'popular':
      return 'i-heroicons-academic-cap'
    case 'pro':
      return 'i-heroicons-star'
    case 'premium':
      return 'i-heroicons-sparkles'
    default:
      return 'i-heroicons-play'
  }
}

// Helper function to get button classes based on plan
const getButtonClasses = (subscription: any) => {
  switch (subscription.badge) {
    case 'popular':
      return 'bg-white text-purple-600 hover:bg-gray-50'
    case 'pro':
      return 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
    case 'premium':
      return 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white'
  }
}

// Helper function to get CTA text based on plan
const getCTAText = (subscription: any) => {
  switch (subscription.badge) {
    case 'popular':
      return t('subscriptions.plans.study.cta')
    case 'pro':
      return t('subscriptions.plans.pro.cta')
    case 'premium':
      return t('subscriptions.plans.premium.cta')
    default:
      return t('subscriptions.plans.start.cta')
  }
}
</script> 