<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <nuxt-link to="/admin" class="text-xl font-semibold text-gray-900">Test Admin</nuxt-link>
            <div class="flex space-x-4">
              <nuxt-link 
                to="/" 
                class="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                active-class="bg-gray-100 text-gray-900"
              >
                Home
              </nuxt-link>
              <nuxt-link 
                to="/admin/question-groups" 
                class="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                active-class="bg-gray-100 text-gray-900"
              >
                Question Groups
              </nuxt-link>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">Welcome, {{ user?.email }}</span>
            <UButton color="gray" variant="outline" @click="signOut">Sign Out</UButton>
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
import { getStorage } from 'firebase/storage'
import { useFirestore } from 'vuefire'

definePageMeta({
  middleware: 'admin-auth',
  ssr: false,
})

const auth = getAuth()
const user = ref(null)
const db = useFirestore()
const storage = getStorage()

provide('db', db)
provide('storage', storage)
provide('user', user)

const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    if (!currentUser) {
      navigateTo('/admin/login')
    }
  })
})
</script> 