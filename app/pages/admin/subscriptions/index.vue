<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ t('admin.subscriptions.title') }}</h2>
          <p class="text-gray-600 mt-1">{{ t('admin.subscriptions.subtitle') }}</p>
        </div>
        <div>
          <UButton :to="localePath('/admin/subscriptions/new')" size="lg">
            {{ t('admin.subscriptions.create') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-3"/>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"/>
        <div class="h-4 bg-gray-200 rounded w-1/4"/>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex">
        <div class="text-red-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ t('admin.subscriptions.errorLoading') }}</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Subscriptions List -->
    <div v-else-if="data && data.length > 0" class="space-y-4">
      <div 
        v-for="subscription in data" 
        :key="subscription.id"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex gap-4">
          <!-- Subscription Icon -->
          <div class="w-20 h-20 flex-shrink-0">
            <div class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
          </div>
          
                      <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ getLocalizedTitle(subscription) || t('admin.subscriptions.untitledSubscription') }}</h3>
                <UBadge 
                  :color="getPublishedColor(subscription.published)"
                  :variant="subscription.published ? 'solid' : 'outline'"
                  size="sm"
                >
                  {{ subscription.published ? t('admin.subscriptions.published') : t('admin.subscriptions.draft') }}
                </UBadge>

              </div>
              
              <div v-if="getLocalizedDescription(subscription)" class="text-gray-600 mb-3 line-clamp-2">
                {{ getLocalizedDescription(subscription) }}
              </div>
              
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span v-if="subscription.price">{{ t('admin.subscriptions.price') }}: {{ subscription.price }}</span>
                <span v-if="subscription.badge">{{ t('admin.subscriptions.badge') }}: {{ subscription.badge }}</span>
                <span v-if="subscription.createdAt">{{ t('admin.subscriptions.created') }}: 
                  <NuxtTime :datetime="subscription.createdAt" />
                </span>
                <span v-if="subscription.updatedAt && subscription.updatedAt !== subscription.createdAt">{{ t('common.updated') }}: 
                  <NuxtTime :datetime="subscription.updatedAt" />
                </span>
              </div>

              <div v-if="getLocalizedFeatures(subscription) && getLocalizedFeatures(subscription).length > 0" class="text-sm text-gray-600">
                <span class="font-medium">{{ t('admin.subscriptions.features') }}:</span>
                <span class="ml-2">{{ getLocalizedFeatures(subscription).slice(0, 3).join(', ') }}</span>
                <span v-if="getLocalizedFeatures(subscription).length > 3" class="text-gray-400">
                  +{{ getLocalizedFeatures(subscription).length - 3 }} {{ t('common.more') }}
                </span>
              </div>
          </div>
          
          <div class="gap-2 ml-4">
            <UButton 
              :to="localePath(`/admin/subscriptions/${subscription.id}`)"
              size="sm" 
              variant="outline"
            >
              {{ t('admin.subscriptions.edit') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
      </div>
      <!-- No subscriptions at all -->
      <template v-if="!data || data.length === 0">
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('admin.subscriptions.noSubscriptionsFound') }}</h3>
        <p class="text-gray-500 mb-6">{{ t('admin.subscriptions.noSubscriptionsMessage') }}</p>
        <UButton :to="localePath('/admin/subscriptions/new')">
          {{ t('admin.subscriptions.createFirst') }}
        </UButton>
      </template>
      <!-- No filtered results -->
      <template v-else>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('admin.subscriptions.noMatchingFilters') }}</h3>
        <p class="text-gray-500 mb-6">{{ t('admin.subscriptions.adjustFilters') }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const db = useFirestore()

const { data, pending, error } = useCollection(
  collection(db, 'subscriptions')
)

const getPublishedColor = (published: boolean) => {
  return published ? 'success' : 'warning'
}

const getLocalizedTitle = (subscription: any) => {
  const currentLang = locale.value
  return subscription[currentLang]?.title || subscription.title || ''
}

const getLocalizedDescription = (subscription: any) => {
  const currentLang = locale.value
  return subscription[currentLang]?.description || subscription.description || ''
}

const getLocalizedFeatures = (subscription: any) => {
  const currentLang = locale.value
  return subscription[currentLang]?.features || subscription.features || []
}

// Meta
useHead({
  title: computed(() => t('admin.subscriptions.adminMeta.title')),
  meta: [
    { name: 'description', content: computed(() => t('admin.subscriptions.adminMeta.description')) }
  ]
})
</script> 