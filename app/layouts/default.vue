<template>
  <div class="min-h-screen flex flex-col bg-white font-exo2">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <NuxtLink :to="$localePath('/')" class="h-full">
            <img src="/logo/light-long.png" alt="English Test" class="h-full">
          </NuxtLink>
          <div class="flex-1"></div>
          
          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-4">
            <UButton
              :to="$localePath('/test')" 
              variant="ghost" 
              size="sm"
              >
              {{ $t('nav.englishTest') }}
            </UButton>
            <UButton
              :to="$localePath('/blog')" 
              variant="ghost" 
              size="sm"
              >
              {{ $t('nav.blog') }}
            </UButton>
            <UButton
              :to="$localePath('/faq')" 
              variant="ghost" 
              size="sm"
              >
              {{ $t('nav.faq') }}
            </UButton>
            <UButton
              :to="$localePath('/contact')" 
              variant="ghost" 
              size="sm"
              >
              {{ $t('nav.contact') }}
            </UButton>
            <UButton 
              v-if="!user"
              variant="ghost" 
              size="sm"
              @click="showLoginModal = true"
              >
              {{ $t('nav.login') }}
            </UButton>
            <UButton 
              v-if="user"
              :to="$localePath('/profile')"
              variant="ghost" 
              size="sm"
              >
              {{ $t('nav.profile') }}
            </UButton>

            <LanguageSelector />
          </nav>

          <!-- Mobile Navigation Toggle -->
          <div class="flex items-center space-x-2 lg:hidden">
            <LanguageSelector />
            <UButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-bars-3"
              @click="showMobileMenu = true"
              aria-label="Open menu"
            />
          </div>
        </div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
      <UContainer>
        <div class="py-8">
          <!-- Social Links -->
          <div class="flex justify-center space-x-6 mb-6">
            <UButton
              to="https://www.instagram.com/_marianna_english?igsh=dWdqemU1cjhidWF3"
              target="_blank"
              variant="ghost"
              size="sm"
              icon="i-simple-icons-instagram"
              class="text-pink-600 hover:text-pink-700"
            >
              {{ $t('footer.instagram') }}
            </UButton>
            
            <UButton
              to="https://t.me/englistry"
              target="_blank"
              variant="ghost"
              size="sm"
              icon="i-simple-icons-telegram"
              class="text-primary-500 hover:text-primary-600"
            >
              {{ $t('footer.telegram') }}
            </UButton>
            
            <UButton
              to="https://www.facebook.com/share/1GBKgHbwQ5/"
              target="_blank"
              variant="ghost"
              size="sm"
              icon="i-simple-icons-facebook"
              class="text-primary-700 hover:text-primary-800"
            >
              {{ $t('footer.facebook') }}
            </UButton>
          </div>
          
          <!-- Copyright -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              &copy; {{ new Date().getFullYear() }} {{ $t('nav.englishTest') }}. {{ $t('footer.copyright') }}.
            </p>
          </div>
        </div>
      </UContainer>
    </footer>
  </div>

  <!-- Mobile Menu -->
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="showMobileMenu"
      class="fixed inset-0 z-50 lg:hidden"
      @click="showMobileMenu = false"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black opacity-50"></div>
      
      <!-- Menu Panel -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div 
          v-if="showMobileMenu"
          class="absolute right-0 top-0 h-full w-full md:w-82 bg-white shadow-xl transform flex flex-col"
          @click.stop
        >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <img src="/logo/light-long.png" alt="English Test" class="h-8">
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          @click="showMobileMenu = false"
          aria-label="Close menu"
        />
      </div>

             <!-- Navigation Items -->
       <nav class="flex-1 overflow-y-auto p-4 space-y-1">
        <UButton
          :to="$localePath('/test')"
          variant="ghost"
          size="lg"
          class="w-full justify-start"
          @click="showMobileMenu = false"
        >
          <UIcon name="i-heroicons-academic-cap" class="w-5 h-5 mr-3" />
          {{ $t('nav.englishTest') }}
        </UButton>
        
        <UButton
          :to="$localePath('/blog')"
          variant="ghost"
          size="lg"
          class="w-full justify-start"
          @click="showMobileMenu = false"
        >
          <UIcon name="i-heroicons-document-text" class="w-5 h-5 mr-3" />
          {{ $t('nav.blog') }}
        </UButton>
        
        <UButton
          :to="$localePath('/faq')"
          variant="ghost"
          size="lg"
          class="w-full justify-start"
          @click="showMobileMenu = false"
        >
          <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 mr-3" />
          {{ $t('nav.faq') }}
        </UButton>
        
        <UButton
          :to="$localePath('/contact')"
          variant="ghost"
          size="lg"
          class="w-full justify-start"
          @click="showMobileMenu = false"
        >
          <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 mr-3" />
          {{ $t('nav.contact') }}
        </UButton>

                 <!-- Divider -->
         <div class="border-t border-gray-200 my-3"></div>

        <!-- User Actions -->
        <UButton
          v-if="!user"
          variant="ghost"
          size="lg"
          class="w-full justify-start"
          @click="handleMobileLogin"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 mr-3" />
          {{ $t('nav.login') }}
        </UButton>
        
        <UButton
          v-if="user"
          :to="$localePath('/profile')"
          variant="ghost"
          size="lg"
          class="w-full justify-start"
          @click="showMobileMenu = false"
        >
          <UIcon name="i-heroicons-user-circle" class="w-5 h-5 mr-3" />
          {{ $t('nav.profile') }}
        </UButton>

        <UButton
          v-if="isAdmin"
          :to="$localePath('/admin')"
          variant="ghost"
          size="lg"
          class="w-full justify-start"
          @click="showMobileMenu = false"
        >
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 mr-3" />
          {{ $t('nav.admin') }}
        </UButton>

        <UButton
          v-if="user"
          variant="ghost"
          size="lg"
          class="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          @click="handleMobileSignOut"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 mr-3" />
          {{ $t('nav.signOut') }}
                 </UButton>
       </nav>
     </div>
   </Transition>
 </div>
</Transition>

  <!-- Login Modal -->
  <ModalLogin v-model:open="showLoginModal"/>
</template>

<script setup lang="ts">
const { user, isAdmin, signOut } = await useAuth()
const showLoginModal = ref(false)
const showMobileMenu = ref(false)

const handleLoginSuccess = () => {
  showLoginModal.value = false
  // Optionally show a success message or redirect
}

const handleMobileLogin = () => {
  showMobileMenu.value = false
  showLoginModal.value = true
}

const handleMobileSignOut = async () => {
  showMobileMenu.value = false
  await signOut()
}

// Close mobile menu when route changes
watch(() => useRoute().path, () => {
  showMobileMenu.value = false
})
</script> 