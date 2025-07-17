<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ $t('admin.login.title') }}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        {{ $t('admin.login.subtitle') }}
      </p>
      
      <form class="bg-white rounded-lg shadow-sm p-8 space-y-6" @submit.prevent="signIn">
        <UFormField :label="$t('admin.login.email')">
          <UInput 
            v-model="email" 
            type="email"
            required
            size="lg"
            class="w-full"
          />
        </UFormField>
        
        <UFormField :label="$t('admin.login.password')">
          <UInput 
            v-model="password" 
            type="password"
            required
            size="lg"
            class="w-full"
          />
        </UFormField>

        <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ authError }}</p>
        </div>

        <div class="flex justify-end">
          <UButton 
            type="submit" 
            :loading="signingIn"
            size="lg"
          >
            {{ $t('admin.login.signIn') }}
          </UButton>
        </div>
      </form>
      
      <div class="text-center">
        <NuxtLink :to="$localePath('/')" class="text-sm text-gray-500 hover:text-gray-700">
          {{ $t('admin.login.backToHome') }}
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
})

// Auth
const auth = getAuth()
const signingIn = ref(false)
const authError = ref('')
const email = ref('')
const password = ref('')
const localePath = useLocalePath()

// Auth methods
const signIn = async () => {
  signingIn.value = true
  authError.value = ''
  
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    localStorage.setItem('hasAdminAccess', 'true')
    navigateTo(localePath('/admin/question-groups'))
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
      navigateTo(localePath('/admin/question-groups'))
    }
  })
})
</script> 