<template>
  <div class="relative">
    <button
      @click="toggleTheme"
      class="group relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-all duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      :aria-label="$t('theme.toggle')"
    >
      <!-- Toggle Background -->
      <div 
        class="absolute inset-0 rounded-full transition-colors duration-300"
        :class="isDark ? 'bg-blue-600' : 'bg-gray-300'"
      ></div>
      
      <!-- Toggle Circle -->
      <div 
        class="relative w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out flex items-center justify-center"
        :class="isDark ? 'translate-x-6' : 'translate-x-0'"
      >
        <!-- Sun Icon -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="scale-0 rotate-180"
          enter-to-class="scale-100 rotate-0"
          leave-active-class="transition-all duration-300"
          leave-from-class="scale-100 rotate-0"
          leave-to-class="scale-0 rotate-180"
        >
          <UIcon 
            v-if="!isDark"
            name="i-heroicons-sun" 
            class="w-3 h-3 text-yellow-500"
          />
        </Transition>
        
        <!-- Moon Icon -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="scale-0 rotate-180"
          enter-to-class="scale-100 rotate-0"
          leave-active-class="transition-all duration-300"
          leave-from-class="scale-100 rotate-0"
          leave-to-class="scale-0 rotate-180"
        >
          <UIcon 
            v-if="isDark"
            name="i-heroicons-moon" 
            class="w-3 h-3 text-blue-400"
          />
        </Transition>
      </div>
      
      <!-- Hover Effect -->
      <div class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
    
    <!-- Tooltip -->
    <div 
      class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
    >
      {{ isDark ? $t('theme.switchToLight') : $t('theme.switchToDark') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script> 