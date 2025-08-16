<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center">
      <div class="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-500" />
      </div>

      <div v-if="isSupport" class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6 text-center border border-purple-200 dark:border-purple-700">
        <div class="flex items-center justify-center mb-3">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <UIcon name="i-heroicons-heart" class="w-6 h-6 text-white" />
          </div>
          <h3 class="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {{ $t('supportSuccess.supportTitle') }}
          </h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ $t('supportSuccess.supportMessage') }}
        </p>
        <div class="mt-4 flex items-center justify-center space-x-2 text-sm text-purple-600 dark:text-purple-400">
          <UIcon name="i-heroicons-sparkles" class="w-4 h-4 animate-pulse" />
          <span>{{ $t('supportSuccess.supportSubtitle') }}</span>
          <UIcon name="i-heroicons-sparkles" class="w-4 h-4 animate-pulse" />
        </div>
      </div>

      <div class="space-y-3">
        <UButton
          to="/"
          variant="solid"
          class="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <UIcon name="i-heroicons-home" class="w-5 h-5 mr-2" />
          {{ $t('supportSuccess.backHome') }}
        </UButton>
        
        <UButton
          to="/contact"
          variant="ghost"
          class="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-2" />
          {{ $t('supportSuccess.contactUs') }}
        </UButton>
      </div>
      
      <!-- Thank You Message -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <UIcon name="i-heroicons-heart" class="w-4 h-4 text-red-500 animate-pulse" />
          <span>{{ $t('supportSuccess.thankYou') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Payment Success - Englistry'
})

definePageMeta({
  title: 'Payment Success'
})

const support = useRouteQuery('support')
const isSupport = computed(() => support.value === 'true')
</script> 