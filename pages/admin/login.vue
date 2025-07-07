<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to manage tests and questions
        </p>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-8">
        <form class="space-y-6" @submit.prevent="signIn">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <UInput 
              v-model="email" 
              type="email" 
              placeholder="admin@example.com"
              required
              size="lg"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <UInput 
              v-model="password" 
              type="password" 
              placeholder="Password"
              required
              size="lg"
            />
          </div>

          <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ authError }}</p>
          </div>

          <UButton 
            type="submit" 
            :loading="signingIn"
            size="lg"
            class="w-full"
          >
            Sign In
          </UButton>
        </form>
      </div>
      
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth  } from 'firebase/auth'

definePageMeta({
  title: 'Admin Login',
  layout: false,
  ssr: false
})

// Auth
const auth = getAuth()
const signingIn = ref(false)
const authError = ref('')
const email = ref('')
const password = ref('')

// Auth methods
const signIn = async () => {
  signingIn.value = true
  authError.value = ''
  
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    // Redirect to admin tests page after successful login
    navigateTo('/admin/tests')
  } catch (error) {
    authError.value = error.message
  } finally {
    signingIn.value = false
  }
}

// Check if already logged in and redirect
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigateTo('/admin/tests')
    }
  })
})
</script> 