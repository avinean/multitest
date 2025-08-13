<template>
  <div v-show="showBanner">
    <!-- Minimized Phone Icon -->
    <div 
      v-if="bannerDismissed"
      @click="bannerDismissed = false"
      class="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-200"
      aria-label="Expand banner"
    >
      <UIcon name="i-heroicons-phone" class="w-8 h-8 text-white" />
      
      <!-- Floating Elements -->
      <div class="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
      <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
    </div>

    <!-- Banner Card -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="transform scale-0 opacity-0 origin-bottom-right"
      enter-to-class="transform scale-100 opacity-100 origin-bottom-right"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100 origin-bottom-right"
      leave-to-class="transform scale-0 opacity-0 origin-bottom-right"
    >
      <div 
        v-if="!bannerDismissed"
        class="absolute right-0 bottom-0 w-400 max-w-sm bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden"
      >
        <!-- Close Button -->
        <button
          @click="bannerDismissed = true"
          class="absolute z-11 top-3 right-3 w-6 h-6 cursor-pointer bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 group"
          aria-label="Close banner"
        >
          <UIcon 
            name="i-heroicons-x-mark" 
            class="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" 
          />
        </button>

        <!-- Content -->
        <div class="p-6 text-white relative">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-2 right-2 w-8 h-8 border border-white/30 rounded-full"></div>
            <div class="absolute bottom-2 left-2 w-6 h-6 border border-white/30 rounded-full"></div>
          </div>
          
          <!-- Text Content -->
          <div class="relative z-10 space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 animate-bounce">
                <UIcon name="i-heroicons-user" class="w-5 h-5 text-white" />
              </div>
              <h3 class="text-lg font-bold leading-tight">
                {{ $t('freeLesson.title') }}
              </h3>
            </div>
            
            <p class="text-sm text-white/90 leading-relaxed">
              {{ $t('freeLesson.description') }}
            </p>

            <!-- Interactive Benefits -->
            <div class="space-y-2">
              <div class="flex items-center space-x-2 text-xs group cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-300 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span class="group-hover:text-white transition-colors duration-200">{{ $t('freeLesson.benefits.free') }}</span>
              </div>
              <div class="flex items-center space-x-2 text-xs group cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-300 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span class="group-hover:text-white transition-colors duration-200">{{ $t('freeLesson.benefits.personalized') }}</span>
              </div>
              <div class="flex items-center space-x-2 text-xs group cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-300 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span class="group-hover:text-white transition-colors duration-200">{{ $t('freeLesson.benefits.expert') }}</span>
              </div>
            </div>

            <!-- CTA Button -->
            <UButton
              @click="showContactModal = true"
              class="w-full bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg group"
            >
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
              {{ $t('freeLesson.cta') }}
            </UButton>
          </div>
        </div>

        <!-- Animated Border -->
        <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </Transition>
  </div>

  <!-- Contact Modal -->
  <ModalContact v-model:open="showContactModal" />
</template>

<script setup lang="ts">
const showBanner = ref(false)
const showContactModal = ref(false)

const bannerDismissed = useCookie<boolean>('free-lesson-dismissed')

onMounted(() =>
  setTimeout(() => {
    showBanner.value = true
  }, 5000)
)
</script>

 