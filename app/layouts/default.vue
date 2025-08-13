<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 font-exo2">
    <!-- Header -->
    <header class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm dark:shadow-gray-900/20">
      <UContainer>
        <div class="flex items-center justify-between h-20">
          <!-- Logo Section -->
          <NuxtLink :to="$localePath('/')" class="flex items-center space-x-3 group">
            <div class="relative">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <UIcon name="i-heroicons-academic-cap" class="w-7 h-7 text-white" />
              </div>
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div class="hidden md:block">
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {{ $t('site.name') }}
              </h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ $t('header.tagline') }}</p>
            </div>
          </NuxtLink>
          
          <div class="flex-1"></div>
          
          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-1">
            <!-- Main Navigation -->
            <div class="flex items-center space-x-1 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl p-1">
              <UButton
                :to="$localePath('/test')" 
                variant="ghost" 
                size="sm"
                class="relative group hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-lg px-4 py-2"
              >
                <UIcon name="i-heroicons-academic-cap" class="w-4 h-4 mr-2" />
                {{ $t('nav.englishTest') }}
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200"></div>
              </UButton>
              <UButton
                :to="$localePath('/blog')" 
                variant="ghost" 
                size="sm"
                class="relative group hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 rounded-lg px-4 py-2"
              >
                <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-2" />
                {{ $t('nav.blog') }}
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-200"></div>
              </UButton>
              <UButton
                :to="$localePath('/faq')" 
                variant="ghost" 
                size="sm"
                class="relative group hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 rounded-lg px-4 py-2"
              >
                <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4 mr-2" />
                {{ $t('nav.faq') }}
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-200"></div>
              </UButton>
              <UButton
                :to="$localePath('/contact')" 
                variant="ghost" 
                size="sm"
                class="relative group hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 rounded-lg px-4 py-2"
              >
                <UIcon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4 mr-2" />
                {{ $t('nav.contact') }}
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-200"></div>
              </UButton>
            </div>

            <!-- Divider -->
            <div class="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-3"></div>

            <!-- User Section -->
            <div class="flex items-center space-x-2">
              <UButton 
                v-if="!user"
                variant="outline" 
                size="sm"
                class="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                @click="showLoginModal = true"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 mr-2" />
                {{ $t('nav.login') }}
              </UButton>
              
              <UButton 
                v-if="user"
                :to="$localePath('/profile')"
                variant="ghost" 
                size="sm"
                class="flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 rounded-lg px-3 py-2"
              >
                <img v-if="user?.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'" class="w-8 h-8 rounded-full" />
                <div v-else class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-user" class="w-4 h-4 text-white" />
                </div>
              </UButton>

              <ThemeSwitcher />
              <LanguageSelector />
            </div>
          </nav>

          <!-- Mobile Navigation Toggle -->
          <div class="flex items-center space-x-3 lg:hidden">
            <!-- User Avatar on Mobile -->
            <div v-if="user" class="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="w-4 h-4 text-white" />
            </div>
            
            <ThemeSwitcher />
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

        <!-- Progress Bar (Optional - for page loading) -->
        <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300" :class="{ 'opacity-100': false }"></div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white mt-auto relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div class="absolute top-20 right-20 w-20 h-20 border border-white/20 rounded-full"></div>
        <div class="absolute bottom-10 left-1/3 w-24 h-24 border border-white/20 rounded-full"></div>
        <div class="absolute bottom-20 right-10 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>
      
      <UContainer class="relative z-10">
        <div class="py-16">
          <!-- Main Footer Content -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            <!-- Brand Section -->
            <div class="space-y-4">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-academic-cap" class="w-6 h-6 text-white" />
                </div>
                <h3 class="text-xl font-bold">{{ $t('site.name') }}</h3>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed">
                {{ $t('site.description') }}
              </p>
              <div class="flex items-center space-x-2 text-sm text-gray-400">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-400" />
                <span>{{ $t('footer.trusted') }}</span>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                <UIcon name="i-heroicons-link" class="w-5 h-5 mr-2 text-blue-400" />
                {{ $t('footer.quickLinks') }}
              </h4>
              <nav class="space-y-3">
                <UButton
                  :to="$localePath('/test')"
                  variant="ghost"
                  size="sm"
                  class="text-gray-300 hover:text-white hover:bg-white/10 justify-start w-full p-2 rounded-lg transition-all duration-200"
                >
                  <UIcon name="i-heroicons-academic-cap" class="w-4 h-4 mr-3" />
                  {{ $t('nav.englishTest') }}
                </UButton>
                <UButton
                  :to="$localePath('/blog')"
                  variant="ghost"
                  size="sm"
                  class="text-gray-300 hover:text-white hover:bg-white/10 justify-start w-full p-2 rounded-lg transition-all duration-200"
                >
                  <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-3" />
                  {{ $t('nav.blog') }}
                </UButton>
                <UButton
                  :to="$localePath('/faq')"
                  variant="ghost"
                  size="sm"
                  class="text-gray-300 hover:text-white hover:bg-white/10 justify-start w-full p-2 rounded-lg transition-all duration-200"
                >
                  <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4 mr-3" />
                  {{ $t('nav.faq') }}
                </UButton>
                <UButton
                  :to="$localePath('/contact')"
                  variant="ghost"
                  size="sm"
                  class="text-gray-300 hover:text-white hover:bg-white/10 justify-start w-full p-2 rounded-lg transition-all duration-200"
                >
                  <UIcon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4 mr-3" />
                  {{ $t('nav.contact') }}
                </UButton>
                <UButton
                  :to="$localePath('/release')"
                  variant="ghost"
                  size="sm"
                  class="text-gray-300 hover:text-white hover:bg-white/10 justify-start w-full p-2 rounded-lg transition-all duration-200"
                >
                  <UIcon name="i-heroicons-rocket-launch" class="w-4 h-4 mr-3" />
                  {{ $t('nav.release') }}
                </UButton>
              </nav>
            </div>

            <!-- Contact Info -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5 mr-2 text-green-400" />
                {{ $t('footer.contact') }}
              </h4>
              <div class="space-y-3">
                <div class="flex items-center space-x-3 text-gray-300">
                  <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-blue-400" />
                  </div>
                  <a
                    href="mailto:englistry@gmail.com"
                    class="text-sm hover:text-white transition-colors duration-200"
                  >
                    englistry@gmail.com
                  </a>
                </div>
                <div class="flex items-center space-x-3 text-gray-300">
                  <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4 text-green-400" />
                  </div>
                  <span class="text-sm">{{ $t('footer.responseTime') }}</span>
                </div>
              </div>
            </div>

            <!-- Social Media -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                <UIcon name="i-heroicons-users" class="w-5 h-5 mr-2 text-purple-400" />
                {{ $t('footer.followUs') }}
              </h4>
              <div class="space-y-3">
                <a
                  href="https://www.instagram.com/_marianna_english?igsh=dWdqemU1cjhidWF3"
                  target="_blank"
                  class="flex items-center space-x-3 text-gray-300 hover:text-white group transition-all duration-200"
                >
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <UIcon name="i-simple-icons-instagram" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div class="text-sm font-medium">{{ $t('footer.instagram') }}</div>
                    <div class="text-xs text-gray-400">@_marianna_english</div>
                  </div>
                </a>
                
                <a
                  href="https://t.me/englistry"
                  target="_blank"
                  class="flex items-center space-x-3 text-gray-300 hover:text-white group transition-all duration-200"
                >
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <UIcon name="i-simple-icons-telegram" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div class="text-sm font-medium">{{ $t('footer.telegram') }}</div>
                    <div class="text-xs text-gray-400">@englistry</div>
                  </div>
                </a>
                
                <a
                  href="https://www.facebook.com/share/1GBKgHbwQ5/"
                  target="_blank"
                  class="flex items-center space-x-3 text-gray-300 hover:text-white group transition-all duration-200"
                >
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <UIcon name="i-simple-icons-facebook" class="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div class="text-sm font-medium">{{ $t('footer.facebook') }}</div>
                    <div class="text-xs text-gray-400">{{ $t('footer.facebookPage') }}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- Bottom Section -->
          <div class="border-t border-white/10 pt-8">
            <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <!-- Copyright -->
              <div class="flex items-center space-x-4">
                <p class="text-sm text-gray-400">
                  &copy; {{ new Date().getFullYear() }} {{ $t('site.name') }}. {{ $t('footer.copyright') }}.
                </p>
              </div>

              <!-- Language & Theme -->
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2 text-sm text-gray-400">
                  <UIcon name="i-heroicons-language" class="w-4 h-4" />
                  <span>{{ $t('footer.multiLanguage') }}</span>
                </div>
                <ThemeSwitcher />
                <LanguageSelector />
              </div>
            </div>
          </div>

          <!-- Floating Elements -->
          <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div class="absolute top-8 right-8 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
            <div class="absolute bottom-8 left-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
            <div class="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
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
      <div class="absolute inset-0 bg-black/50 dark:bg-black/70"></div>
      
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
          class="absolute right-0 top-0 h-full w-full md:w-82 bg-white dark:bg-gray-900 shadow-xl dark:shadow-gray-950/50 transform flex flex-col"
          @click.stop
        >
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <img src="/logo/light-long.png" alt="English Test" class="h-8">
            <UButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-x-mark"
              @click="showMobileMenu = false"
              aria-label="Close menu"
            />
          </div>

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
              <img v-if="user?.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'" class="w-5 h-5 mr-3 rounded-full" />
              <UIcon v-else name="i-heroicons-user-circle" class="w-5 h-5 mr-3" />
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

            <!-- Theme Switcher -->
            <div class="flex items-center justify-between w-full px-3 py-2">
              <div class="flex items-center space-x-3">
                <UIcon name="i-heroicons-swatch" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t('theme.toggle') }}</span>
              </div>
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      </Transition>
    </div>
  </Transition>
  <ModalLogin v-model:open="showLoginModal"/>
  <ClientOnly>
    <div class="fixed bottom-4 right-4 z-40 flex gap-4">
      <SupportBanner />
      <FreeLessonBanner />
    </div>
  </ClientOnly>
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