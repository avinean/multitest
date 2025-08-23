<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('profile.subscriptions.title') }}</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">{{ $t('profile.subscriptions.description') }}</p>
    </div>

    <!-- Subscriptions List -->
    <div v-if="subscriptions && subscriptions.length > 0" class="space-y-6">
      <div 
        v-for="subscription in subscriptions" 
        :key="subscription.invoiceId"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <!-- Subscription Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-credit-card" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ subscription[$i18n.locale]?.title || $t('profile.subscriptions.planName') }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ $t('profile.subscriptions.invoice') }}: {{ subscription.invoiceId }}
              </p>
            </div>
          </div>
          
          <!-- Status Badge -->
          <UBadge 
            :color="getSubscriptionStatusColor(subscription)"
            variant="solid"
            class="text-xs font-medium"
          >
            {{ getSubscriptionStatusText(subscription) }}
          </UBadge>
        </div>

        <!-- Subscription Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('profile.subscriptions.startDate') }}
            </label>
            <p class="text-gray-900 dark:text-white">
              <NuxtTime :datetime="subscription.updatedAt" month="long" day="numeric" year="numeric" locale="uk" />
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('profile.subscriptions.expiryDate') }}
            </label>
            <p class="text-gray-900 dark:text-white">
              <NuxtTime :datetime="subscription.expiryDate" month="long" day="numeric" year="numeric" locale="uk" />
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('profile.subscriptions.planId') }}
            </label>
            <p class="text-gray-900 dark:text-white font-mono text-sm">
              {{ subscription.planId }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <!-- <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UButton
            v-if="isSubscriptionExpired(subscription)"
            variant="outline"
            color="primary"
            @click="renewSubscription(subscription)"
          >
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
            {{ $t('profile.subscriptions.renewSubscription') }}
          </UButton>
          
          <UButton
            v-if="!isSubscriptionExpired(subscription)"
            variant="outline"
            color="error"
            @click="cancelSubscription(subscription)"
          >
            <UIcon name="i-heroicons-x-circle" class="w-4 h-4 mr-2" />
            {{ $t('profile.subscriptions.cancelSubscription') }}
          </UButton>
        </div> -->
      </div>
    </div>

    <!-- No Subscriptions State -->
    <div v-else class="mx-auto py-20">
      <div class="text-center">
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
          <UIcon name="i-heroicons-credit-card" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ $t('profile.subscriptions.noSubscriptions') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ $t('profile.subscriptions.noSubscriptionsMessage') }}
          </p>
          <UButton
            :to="$localePath('/subscriptions')"
            color="primary"
            size="lg"
          >
            <UIcon name="i-heroicons-plus" class="w-5 h-5 mr-2" />
            {{ $t('profile.subscriptions.getSubscription') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, documentId, query, where } from 'firebase/firestore'

definePageMeta({
  layout: 'default'
})

const { profile } = await useAuth()
const localePath = useLocalePath()

const db = useFirestore()

const { data, pending, error } = useCollection<Subscription>(query(
  collection(db, 'subscriptions'),
  where(documentId(), 'in', profile.value?.subscriptions?.map(s => s.planId) || [])
))

const subscriptions = computed<(Subscription & Profile['subscriptions'][number])[]>(() => {
  return data.value?.map(doc => ({
    ...doc,
    ...(profile.value?.subscriptions?.find(s => s.planId === doc.id) || {})
  })).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}) || []

useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' },
    { property: 'og:robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'User subscriptions - private area' }
  ]
})

// Handle subscription renewal
const renewSubscription = async (subscription: Profile['subscriptions'][number]) => {
  try {
    // Navigate to subscriptions page to renew
    await navigateTo(localePath('/subscriptions'))
  } catch (error) {
    console.error('Error navigating to subscriptions:', error)
  }
}

// Handle subscription cancellation
const cancelSubscription = async (subscription: Profile['subscriptions'][number]) => {
  try {
    // Here you would implement the cancellation logic
    // For now, just show a confirmation dialog
    if (confirm($t('profile.subscriptions.cancelSubscription'))) {
      console.log('Cancelling subscription:', subscription.invoiceId)
      // TODO: Implement actual cancellation logic
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
  }
}

// Helper to determine if a subscription is expired
const isSubscriptionExpired = (subscription: Profile['subscriptions'][number]) => {
  const expiryDate = new Date(subscription.expiryDate);
  const today = new Date();
  return expiryDate < today;
};

// Helper to get subscription status color
const getSubscriptionStatusColor = (subscription: Profile['subscriptions'][number]) => {
  const expiryDate = new Date(subscription.expiryDate);
  const today = new Date();
  if (expiryDate < today) {
    return 'error';
  }
  return 'success';
};

// Helper to get subscription status text
const getSubscriptionStatusText = (subscription: Profile['subscriptions'][number]) => {
  const expiryDate = new Date(subscription.expiryDate);
  const today = new Date();
  if (expiryDate < today) {
    return $t('profile.subscriptions.expired');
  }
  return $t('profile.subscriptions.active');
};
</script> 