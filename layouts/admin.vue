<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <nuxt-link :to="$localePath('/admin')" class="text-xl font-semibold text-gray-900">{{ $t('admin.title') }}</nuxt-link>
            <div class="flex space-x-4">
              <nuxt-link 
                :to="$localePath('/')" 
                class="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                active-class="bg-gray-100 text-gray-900"
              >
                {{ $t('admin.navigation.home') }}
              </nuxt-link>
              <nuxt-link 
                :to="$localePath('/admin/question-groups')" 
                class="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                active-class="bg-gray-100 text-gray-900"
              >
                {{ $t('admin.navigation.questionGroups') }}
              </nuxt-link>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <LanguageSelector />
            <span class="text-sm text-gray-600">{{ $t('admin.welcome') }}, {{ user?.email }}</span>
            <UButton color="gray" variant="outline" @click="signOut">{{ $t('admin.signOut') }}</UButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { signOut as firebaseSignOut, onAuthStateChanged, getAuth } from 'firebase/auth'

const auth = getAuth()
const user = ref(null)

provide('user', user)

const localePath = useLocalePath()

const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    await navigateTo(localePath('/admin/login'))
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    if (!currentUser) {
      navigateTo(localePath('/admin/login'))
    }
  })
})
</script> 