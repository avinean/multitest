<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6">
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('profile.payments.title') }}
      </h1>
      <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">
        {{ t('profile.payments.description') }}
      </p>
    </div>

    <!-- Payment History -->
    <div v-if="data && data.length > 0" class="space-y-4">
      <div v-for="payment in data" :key="payment.id" 
           class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <!-- Mobile Layout -->
        <div class="block sm:hidden">
          <div class="flex items-start space-x-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-credit-card" class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white truncate">
                {{ t('profile.payments.invoice') }} #{{ payment.invoiceId }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                <NuxtTime :datetime="payment.createdAt" />
              </p>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="text-center">
              <div class="text-xl font-bold text-gray-900 dark:text-white">
                {{ payment.amount }} {{ t('uah') }}
              </div>
              <div :class="`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(payment.status)}`">
                <UIcon :name="getStatusIcon(payment.status)" class="w-3 h-3 mr-1" />
                <span>{{ getStatusText(payment.status) }}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-1 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {{ t('profile.payments.email') }}:
                </span>
                <p class="text-sm text-gray-900 dark:text-white break-all">{{ payment.email }}</p>
              </div>
              <div>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {{ t('profile.payments.status') }}:
                </span>
                <p class="text-sm text-gray-900 dark:text-white">{{ getStatusText(payment.status) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop/Tablet Layout -->
        <div class="hidden sm:block">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UIcon name="i-heroicons-credit-card" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ t('profile.payments.invoice') }} #{{ payment.invoiceId }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  <NuxtTime :datetime="payment.createdAt" />
                </p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ payment.amount }} {{ t('uah') }}
              </div>
              <div :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`">
                <UIcon :name="getStatusIcon(payment.status)" class="w-4 h-4 mr-1" />
                <span>{{ getStatusText(payment.status) }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ t('profile.payments.email') }}:
              </span>
              <p class="text-gray-900 dark:text-white break-all">{{ payment.email }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ t('profile.payments.status') }}:
              </span>
              <p class="text-gray-900 dark:text-white">{{ getStatusText(payment.status) }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ t('profile.payments.type') }}:
              </span>
              <p class="text-gray-900 dark:text-white capitalize">{{ payment.type }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!pending" class="text-center py-8 sm:py-12 px-4">
      <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-heroicons-credit-card" class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
      </div>
      <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('profile.payments.empty.title') }}
      </h3>
      <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {{ t('profile.payments.empty.description') }}
      </p>
      <NuxtLink to="/subscriptions" 
                class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
        <UIcon name="i-heroicons-plus" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        {{ t('profile.payments.empty.cta') }}
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-8 sm:py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-500 mx-auto mb-4"/>
        <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300">{{ t('common.loading') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6 text-center mx-4 sm:mx-0">
      <div class="text-red-500 dark:text-red-400 text-3xl sm:text-4xl mb-4">⚠️</div>
      <h2 class="text-lg sm:text-xl font-bold text-red-800 dark:text-red-200 mb-2">{{ t('common.error') }}</h2>
      <p class="text-sm sm:text-base text-red-600 dark:text-red-300">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

const { t } = useI18n()
const { user } = await useAuth()
const db = useFirestore()

useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' },
    { property: 'og:robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'User payment history - private area' }
  ],
  title: t('profile.payments.pageTitle')
})

// Fetch user's payments using useAsyncData
const { data, pending, error } = await useAsyncData(
  'user-payments',
  async () => {
    const querySnapshot = await getDocs(query(
      collection(db, 'payments'),
      where('email', '==', user.value?.email),
      orderBy('createdAt', 'desc')
    ))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Payment))
  }
)

// Get status text
function getStatusText(status: string): string {
  if (status === 'success') return t('profile.payments.statuses.success')
  return t('profile.payments.statuses.pending')
}

function getStatusColor(status: string): string {
  if (status === 'success') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
}

// Get status icon
function getStatusIcon(status: string): string {
  if (status === 'success') return 'i-heroicons-check-circle'
  return 'i-heroicons-clock'
}
</script> 