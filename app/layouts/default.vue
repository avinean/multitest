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
          <nav class="flex items-center space-x-4">
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

  <!-- Login Modal -->
  <ModalLogin v-model:open="showLoginModal"/>
</template>

<script setup lang="ts">
const { user, isAdmin } = await useAuth()
const showLoginModal = ref(false)



const handleLoginSuccess = () => {
  showLoginModal.value = false
  // Optionally show a success message or redirect
}
</script> 