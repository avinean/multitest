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
              v-if="hasAdminAccess"
              :to="$localePath('/admin/login')" 
              variant="ghost" 
              size="sm"
              >
              {{ $t('nav.admin') }}
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
</template>

<script setup>
const hasAdminAccess = useLocalStorage('hasAdminAccess', false)
</script> 