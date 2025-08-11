<template>
  <UModal v-model:open="open" class="max-w-md mx-auto" :ui="{ header: 'hidden' }">
    <template #body>
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 -m-6 p-6 text-white relative">
        <!-- Close Button -->
        <UButton
          @click="closeModal"
          variant="ghost"
          icon="i-heroicons-x-mark"
          class="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 group text-white"
          aria-label="Close modal"
        />
        
        <!-- Title -->
        <div class="text-center">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-phone" class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-2xl font-bold mb-2">{{ $t('contactModal.title') }}</h2>
          <p class="text-blue-100">{{ $t('contactModal.subtitle') }}</p>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <!-- Contact Methods -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 mr-2 text-blue-500" />
            {{ $t('contactModal.contactMethods') }}
          </h3>
          
          <!-- Telegram -->
          <a
            href="https://t.me/MEnglistry"
            target="_blank"
            class="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 group"
          >
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <UIcon name="i-simple-icons-telegram" class="w-5 h-5 text-white" />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Telegram</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">@MEnglistry</div>
            </div>
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-gray-400 ml-auto" />
          </a>

          <!-- Instagram -->
          <a
            href="https://www.instagram.com/_marianna_english?igsh=dWdqemU1cjhidWF3"
            target="_blank"
            class="flex items-center space-x-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all duration-200 group"
          >
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <UIcon name="i-simple-icons-instagram" class="w-5 h-5 text-white" />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Instagram</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">@_marianna_english</div>
            </div>
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-gray-400 ml-auto" />
          </a>

          <!-- Email -->
          <a
            href="mailto:englistry@gmail.com"
            class="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 group"
          >
            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-white" />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Email</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">englistry@gmail.com</div>
            </div>
            <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-gray-400 ml-auto" />
          </a>
        </div>

        <!-- Callback Form -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2 text-green-500" />
            {{ $t('contactModal.callbackTitle') }}
          </h3>
          
          <form @submit.prevent="submitCallback" class="space-y-4">
            <UFormField :label="$t('contactModal.phoneLabel')" name="phone">
              <UInput
                v-model="phoneNumber"
                type="tel"
                :placeholder="$t('contactModal.phonePlaceholder')"
                required
                class="w-full"
              />
            </UFormField>
            
            <UFormField :label="$t('contactModal.nameLabel')" name="name">
              <UInput
                v-model="name"
                type="text"
                :placeholder="$t('contactModal.namePlaceholder')"
                required
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              :loading="isSubmitting"
              variant="solid"
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <UIcon name="i-heroicons-phone" class="w-4 h-4 mr-2" />
              {{ $t('contactModal.submitButton') }}
            </UButton>
          </form>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const open = defineModel<boolean>('open')

const phoneNumber = ref('')
const name = ref('')
const isSubmitting = ref(false)

const closeModal = () => {
  open.value = false
  phoneNumber.value = ''
  name.value = ''
}

const submitCallback = async () => {
  if (!phoneNumber.value || !name.value) return
  
  isSubmitting.value = true
  
  try {
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message
    const toast = useToast()
    toast.add({
      title: 'Success!',
      description: 'We will call you back soon.',
      color: 'success'
    })
    
    closeModal()
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to submit request. Please try again.',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script> 