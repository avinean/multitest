<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center">
      <!-- Success Icon -->
      <div class="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-500" />
      </div>
      <template v-if="hasInvoice && paymentData">
        <!-- Success Message -->
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('supportSuccess.title') }}
        </h1>
        
        <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {{ $t('supportSuccess.message') }}
        </p>
        
        <!-- Support Amount Info - Only show for invoice payments -->
        <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {{ $t('supportSuccess.amountLabel') }}
          </div>
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">
            {{ formatAmount(paymentData?.finalAmount, paymentData?.ccy) }}
          </div>
        </div>
      </template>

      <!-- Support Message - Only show for support payments -->
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

      <!-- Payment Details - Only show for invoice payments -->
      <div v-if="hasInvoice && paymentData?.paymentInfo" class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6 text-left">
        <div class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {{ $t('supportSuccess.paymentDetails') }}
        </div>
        <div class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div class="flex justify-between">
            <span>{{ $t('supportSuccess.transactionId') }}:</span>
            <span class="font-mono">{{ paymentData.paymentInfo?.tranId }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ $t('supportSuccess.approvalCode') }}:</span>
            <span class="font-mono">{{ paymentData.paymentInfo?.approvalCode }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ $t('supportSuccess.paymentMethod') }}:</span>
            <span class="capitalize">{{ paymentData.paymentInfo?.paymentSystem }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ $t('supportSuccess.cardNumber') }}:</span>
            <span class="font-mono">{{ paymentData.paymentInfo?.maskedPan }}</span>
          </div>
          <div class="flex justify-between">
            <span>{{ $t('supportSuccess.date') }}:</span>
            <span>{{ formatDate(paymentData.createdDate) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
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
// Set page title
useHead({
  title: 'Payment Success - Englistry'
})

// Add success page translations
definePageMeta({
  title: 'Payment Success'
})

const invoiceId = useRouteQuery('invoiceId')
const support = useRouteQuery('support')

const { checkPayment } = useMono()

// Only fetch payment data if invoiceId is present
const { data: paymentData } = await useAsyncData('payment', () => {
  if (invoiceId.value) {
    return checkPayment(invoiceId.value as string)
  }
  return Promise.resolve(null)
})

// Check if this is a support payment (support=true) or regular payment (invoiceId)
const isSupport = computed(() => support.value === 'true')
const hasInvoice = computed(() => !!invoiceId.value)

// Format amount with currency
const formatAmount = (amount: number | undefined, ccy: number | undefined) => {
  if (!amount || !ccy) return 'N/A'
  
  // Map currency codes to symbols
  const currencySymbols: Record<number, string> = {
    980: '₴', // Ukrainian Hryvnia
    840: '$', // US Dollar
    978: '€', // Euro
    826: '£', // British Pound
  }
  
  const symbol = currencySymbols[ccy] || ''
  return `${symbol}${amount.toFixed(2)}`
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'N/A'
  }
}
</script> 