<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink :to="$localePath('/')" class="text-xl font-bold">
              {{ $t('nav.englishTest') }}
            </NuxtLink>
          </div>
          
          <nav class="flex items-center space-x-4">
            <UButton
              :to="$localePath('/blog')" 
              variant="ghost" 
              size="sm"
              >
              {{ $t('nav.blog') }}
            </UButton>
            <UButton 
              v-if="isAdmin"
              :to="$localePath('/admin')" 
              variant="ghost" 
              size="sm"
              >
              {{ $t('nav.admin') }}
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
              variant="ghost" 
              size="sm"
              @click="handleSignOut"
              >
              {{ $t('nav.signOut') }}
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
              class="text-blue-500 hover:text-blue-600"
            >
              {{ $t('footer.telegram') }}
            </UButton>
            
            <UButton
              to="https://www.facebook.com/share/1GBKgHbwQ5/"
              target="_blank"
              variant="ghost"
              size="sm"
              icon="i-simple-icons-facebook"
              class="text-blue-700 hover:text-blue-800"
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

<script setup>
const { user, isAdmin, signOut, initAuth } = useAuth()
const localePath = useLocalePath()
const showLoginModal = ref(false)

// Initialize auth on mount
onMounted(() => {
  const unsubscribe = initAuth()
  
  onUnmounted(() => {
    unsubscribe()
  })
})

const handleSignOut = async () => {
  try {
    await signOut()
    await navigateTo(localePath('/'))
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

const handleLoginSuccess = () => {
  showLoginModal.value = false
  // Optionally show a success message or redirect
}
</script> 