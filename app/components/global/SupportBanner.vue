<template>
  <!-- Main Support Modal -->
  <UModal v-model:open="open" class="max-w-lg mx-auto" :ui="{ header: 'hidden' }">
    <template #body>
      <div class="bg-gradient-to-r from-green-500 to-blue-600 -mt-6 -mx-6 p-6 text-white relative">
        <!-- Close Button -->
        <UButton
          @click="open = false"
          variant="ghost"
          icon="i-heroicons-minus"
          class="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 group text-white"
          aria-label="Minimize modal"
        />
        
        <!-- Title -->
        <div class="text-center">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-heart" class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-2xl font-bold mb-2">{{ $t('supportModal.title') }}</h2>
          <p class="text-green-100">{{ $t('supportModal.subtitle') }}</p>
        </div>
      </div>
      <div class="p-6 space-y-6">
        <!-- Social Sharing -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <UIcon name="i-heroicons-share" class="w-5 h-5 mr-2 text-blue-500" />
            {{ $t('supportModal.shareTitle') }}
          </h3>
          
          <div class="grid grid-cols-2 gap-3">
            <!-- Telegram Share -->
            <button
              @click="shareViaTelegram"
              class="flex items-center justify-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 group"
            >
              <UIcon name="i-simple-icons-telegram" class="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
              <span class="font-medium text-gray-900 dark:text-white">{{ $t('supportModal.shareTelegram') }}</span>
            </button>

            <!-- WhatsApp Share -->
            <button
              @click="shareViaWhatsApp"
              class="flex items-center justify-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 group"
            >
              <UIcon name="i-simple-icons-whatsapp" class="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
              <span class="font-medium text-gray-900 dark:text-white">{{ $t('supportModal.shareWhatsApp') }}</span>
            </button>

            <!-- Facebook Share -->
            <button
              @click="shareViaFacebook"
              class="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 group"
            >
              <UIcon name="i-simple-icons-facebook" class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span class="font-medium">{{ $t('supportModal.shareFacebook') }}</span>
            </button>

            <!-- Twitter Share -->
            <button
              @click="shareViaTwitter"
              class="flex items-center justify-center space-x-2 p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 group"
            >
              <UIcon name="i-simple-icons-twitter" class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span class="font-medium">{{ $t('supportModal.shareTwitter') }}</span>
            </button>
          </div>
        </div>

        <!-- Financial Support -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <UIcon name="i-heroicons-credit-card" class="w-5 h-5 mr-2 text-green-500" />
            {{ $t('supportModal.financialTitle') }}
          </h3>
          
          <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <div class="space-y-4">
              <p class="text-sm text-gray-700 dark:text-gray-300 text-center">
                {{ $t('supportModal.financialMessage') }}
              </p>
              
              <!-- Preset Amount Options -->
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="amount in presetAmounts"
                  :key="amount"
                  @click="selectedAmount = amount"
                  :class="[
                    'p-3 rounded-xl border-2 transition-all duration-200 font-semibold',
                    selectedAmount === amount
                      ? 'border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-green-300 dark:hover:border-green-600'
                  ]"
                >
                  {{ amount }} ₴
                </button>
              </div>
              
              <!-- Custom Amount Input -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {{ $t('supportModal.customAmount') }}
                </label>
                <div class="relative">
                  <input
                    v-model="selectedAmount"
                    type="number"
                    min="1"
                    step="1"
                    :placeholder="$t('supportModal.enterAmount')"
                    class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    ₴
                  </div>
                </div>
              </div>
              
              <!-- Support Button -->
              <UButton
                @click="handleSupport"
                :disabled="!selectedAmount || selectedAmount < 1"
                variant="solid"
                class="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                <UIcon name="i-heroicons-heart" class="w-5 h-5 mr-2" />
                {{ $t('supportModal.supportButton') }} {{ selectedAmount || 0 }} ₴
              </UButton>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <p>{{ $t('supportModal.thankYou') }}</p>
          <div class="flex items-center justify-center space-x-1">
            <UIcon name="i-heroicons-heart" class="w-4 h-4 text-red-500 animate-pulse" />
            <span>{{ $t('supportModal.madeWithLove') }}</span>
          </div>
        </div>
      </div>
    </template>
  </UModal>

  <!-- Minimized Support Widget -->
  <button 
    @click="open = true"
    class="bg-gradient-to-r from-green-500 to-blue-600 rounded-full w-16 h-16 shadow-2xl flex items-center justify-center text-white transform hover:scale-110 transition-all duration-200"
  >
    <UIcon name="i-heroicons-heart" class="w-8 h-8" />
    <div class="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
    <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
  </button>
</template>

<script setup lang="ts">
const { pay } = await useMono()

const presetAmounts = [250, 500, 1000]
const selectedAmount = ref<number | null>(null)

// Minimized widget state with cookie persistence
const open = ref(false)

// Check if banner has been shown this session
const hasShownThisSession = ref(false)

const handleSupport = async () => {
  if (!selectedAmount.value) return
  try {
    await pay({ amount: +selectedAmount.value * 100, type: 'support' })
    open.value = false
    console.log(`Support payment of ${selectedAmount.value} ₴ initiated successfully`)
  } catch (error) {
    console.error('Payment failed:', error)
  }
}

const shareViaTelegram = () => {
  const text = encodeURIComponent($t('supportModal.shareText'))
  const url = encodeURIComponent(window.location.href)
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
}

const shareViaWhatsApp = () => {
  const text = encodeURIComponent($t('supportModal.shareText'))
  const url = encodeURIComponent(window.location.href)
  window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
}

const shareViaFacebook = () => {
  const url = encodeURIComponent(window.location.href)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
}

const shareViaTwitter = () => {
  const text = encodeURIComponent($t('supportModal.shareText'))
  const url = encodeURIComponent(window.location.href)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
}

// Show banner only once per session
onMounted(() => {
  // Check if we've already shown the banner this session
  if (typeof window !== 'undefined') {
    hasShownThisSession.value = sessionStorage.getItem('support-banner-shown') === 'true'
    
    if (!hasShownThisSession.value) {
      // Show banner after 2 seconds and mark as shown
      setTimeout(() => {
        open.value = true
        sessionStorage.setItem('support-banner-shown', 'true')
        hasShownThisSession.value = true
      }, 1000 * 60 * 5)
    }
  }
})
</script> 