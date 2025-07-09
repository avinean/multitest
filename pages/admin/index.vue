

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"/>
      <p class="text-gray-600">
        {{ checking ? 'Checking authentication...' : 'Redirecting...' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onAuthStateChanged, getAuth } from 'firebase/auth'

definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

const auth = getAuth()
const checking = ref(true)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigateTo('/admin/question-groups')
    } else {
      navigateTo('/admin/login')
    }
    checking.value = false
  })
})
</script>