<template>
  <UModal v-model:open="isOpen">
    <template #body>
      <div class="space-y-6">
        
        <!-- Header -->
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isSignUp ? $t('auth.signUp.title') : $t('auth.signIn.title') }}
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mt-2">
            {{ isSignUp ? $t('auth.signUp.subtitle') : $t('auth.signIn.subtitle') }}
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ authError }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="authSuccess" class="p-3 bg-green-50 border border-green-200 rounded-md">
          <p class="text-sm text-green-600">{{ authSuccess }}</p>
        </div>

        <!-- Email/Password Form -->
        <form @submit.prevent="isSignUp ? signUp() : signIn()" class="space-y-4">
          <UFormField :label="$t('auth.email')">
            <UInput 
              v-model="email" 
              type="email"
              required
              size="lg"
              class="w-full"
              :placeholder="$t('auth.emailPlaceholder')"
            />
          </UFormField>
          
          <UFormField :label="$t('auth.password')">
            <UInput 
              v-model="password" 
              type="password"
              required
              size="lg"
              class="w-full"
              :placeholder="$t('auth.passwordPlaceholder')"
            />
          </UFormField>

          <!-- Confirm Password for Sign Up -->
          <UFormField v-if="isSignUp" :label="$t('auth.confirmPassword')">
            <UInput 
              v-model="confirmPassword" 
              type="password"
              required
              size="lg"
              class="w-full"
              :placeholder="$t('auth.confirmPasswordPlaceholder')"
            />
          </UFormField>
          
          <div class="flex justify-center">
            <UButton 
              type="submit" 
              :loading="signingIn || signingUp"
              size="lg"
              class="mx-auto"
            >
              {{ isSignUp ? $t('auth.signUp.button') : $t('auth.signIn.button') }}
            </UButton>
          </div>
        </form>

        <!-- Toggle between Sign In and Sign Up -->
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ isSignUp ? $t('auth.signUp.haveAccount') : $t('auth.signIn.noAccount') }}
            <button 
              type="button"
              class="text-primary-600 hover:text-primary-700 font-medium ml-1"
              @click="toggleMode"
            >
              {{ isSignUp ? $t('auth.signUp.signInLink') : $t('auth.signIn.signUpLink') }}
            </button>
          </p>
        </div>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white dark:bg-gray-900 text-gray-500">{{ $t('auth.or') }}</span>
          </div>
        </div>

        <!-- Google Sign In Button -->
        <div class="flex justify-center">
          <UButton 
            type="button"
            color="primary"
            variant="ghost"
            size="lg"
            class="mx-auto"
            :loading="signingInWithGoogle"
            @click="signInWithGoogle"
          >
            <div class="flex items-center justify-center gap-3">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{{ $t('auth.signInWithGoogle') }}</span>
            </div>
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth'

const { redirect, initialMode = 'signin' } = defineProps<{
  redirect?: string
  initialMode?: 'signin' | 'signup'
}>()
const isOpen = defineModel<boolean>('open')

// Auth
const auth = getAuth()
const localePath = useLocalePath()
const signingIn = ref(false)
const signingUp = ref(false)
const signingInWithGoogle = ref(false)
const authError = ref('')
const authSuccess = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSignUp = ref(initialMode === 'signup')

const close = () => {
  isOpen.value = false
  if (redirect) {
    navigateTo(redirect)
  }
}

// Toggle between sign in and sign up modes
const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  authError.value = ''
  authSuccess.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
}

// Auth methods
const signIn = async () => {
  signingIn.value = true
  authError.value = ''
  authSuccess.value = ''
  
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)    
    close()
  } catch (error: any) {
    authError.value = error.message
  } finally {
    signingIn.value = false
  }
}

// Sign up method
const signUp = async () => {
  signingUp.value = true
  authError.value = ''
  authSuccess.value = ''
  
  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    authError.value = $t('auth.signUp.passwordMismatch')
    signingUp.value = false
    return
  }

  // Validate password strength
  if (password.value.length < 6) {
    authError.value = $t('auth.signUp.passwordTooShort')
    signingUp.value = false
    return
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    authSuccess.value = $t('auth.signUp.success')
    
    // Wait a moment to show success message before closing
    setTimeout(() => {
      close()
    }, 1500)
  } catch (error: any) {
    authError.value = error.message
  } finally {
    signingUp.value = false
  }
}

// Google Sign In
const signInWithGoogle = async () => {
  signingInWithGoogle.value = true
  authError.value = ''
  authSuccess.value = ''
  
  try {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    close()
  } catch (error: any) {
    console.error('Google sign-in error:', error)
    authError.value = error.message || 'Failed to sign in with Google'
  } finally {
    signingInWithGoogle.value = false
  }
}

// Reset form when modal opens/closes
watch(isOpen, (newValue) => {
  if (newValue) {
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    authError.value = ''
    authSuccess.value = ''
    isSignUp.value = initialMode === 'signup'
  }
})
</script> 