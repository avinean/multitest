<template>
  <div class="max-w-6xl mx-auto">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('profile.welcome') }}, {{ user?.displayName || user?.email }}!</h1>
      <p class="text-gray-600 mt-2">{{ $t('profile.dashboardSubtitle') }}</p>
    </div>

    <!-- Dashboard Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Profile Info Card -->
      <UCard 
        class="hover:shadow-md transition-shadow cursor-pointer" 
        @click="navigateTo($localePath('/profile/settings'))"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-primary-600" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('profile.settings') }}</h3>
        <p class="text-gray-600 text-sm">{{ $t('profile.settingsDescription') }}</p>
      </UCard>

      <!-- Test Results Card -->
      <UCard 
        class="hover:shadow-md transition-shadow cursor-pointer" 
        @click="navigateTo($localePath('/profile/tests'))"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-green-600" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('profile.testResults') }}</h3>
        <p class="text-gray-600 text-sm">{{ $t('profile.testResultsDescription') }}</p>
      </UCard>

      <!-- Stats Card -->
      <UCard>
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('profile.statistics') }}</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">{{ $t('profile.testsTaken') }}</span>
            <span class="font-semibold text-gray-900">{{ testCount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">{{ $t('profile.averageScore') }}</span>
            <span class="font-semibold text-gray-900">{{ averageScore }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">{{ $t('profile.lastTest') }}</span>
            <span class="font-semibold text-gray-900">{{ lastTestDate }}</span>
          </div>
        </div>
      </UCard>

      <!-- Admin Card (if admin) -->
      <UCard 
        v-if="isAdmin"
        class="hover:shadow-md transition-shadow cursor-pointer" 
        @click="navigateTo($localePath('/admin'))"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6 text-red-600" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('profile.adminPanel') }}</h3>
        <p class="text-gray-600 text-sm">{{ $t('profile.adminDescription') }}</p>
      </UCard>

      <!-- Sign Out Card -->
      <UCard 
        class="hover:shadow-md transition-shadow cursor-pointer" 
        @click="handleSignOut"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-6 h-6 text-gray-600" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('nav.signOut') }}</h3>
        <p class="text-gray-600 text-sm">{{ $t('profile.signOutDescription') }}</p>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

definePageMeta({
  layout: 'default'
})

const { user, isAdmin, signOut } = await useAuth()
const localePath = useLocalePath()
const db = useFirestore()

// Mock data for now - you can replace with real data from Firestore
const testCount = ref(0)
const averageScore = ref(0)
const lastTestDate = ref('-')

// Load user's test statistics
const loadTestStats = async () => {
  if (!user.value?.uid) return
  
  try {
    const testResultsRef = collection(db, 'test-results')
    const q = query(testResultsRef, where('email', '==', user.value.email))
    const querySnapshot = await getDocs(q)
    
    const results = querySnapshot.docs.map(doc => doc.data())
    testCount.value = results.length
    
    if (results.length > 0) {
      const totalScore = results.reduce((sum, result) => sum + (result.percentage || 0), 0)
      averageScore.value = Math.round(totalScore / results.length)
      
      // Get the most recent test
      const sortedResults = results.sort((a, b) => b.createdAt - a.createdAt)
      const lastTest = sortedResults[0]
      if (lastTest?.createdAt) {
        lastTestDate.value = new Date(lastTest.createdAt).toLocaleDateString()
      }
    }
  } catch (error) {
    console.error('Error loading test stats:', error)
  }
}

const handleSignOut = async () => {
  try {
    await signOut()
    await navigateTo(localePath('/'))
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

onMounted(() => {
  loadTestStats()
})
</script>