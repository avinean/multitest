<template>
  <div class="max-w-6xl mx-auto">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('profile.welcome') }}, {{ user?.displayName || user?.email }}!</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">{{ $t('profile.dashboardSubtitle') }}</p>
    </div>

    <!-- Dashboard Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Profile Info Card -->
      <UCard 
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/25 transition-all duration-200 cursor-pointer group" 
        @click="navigateTo($localePath('/profile/settings'))"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('profile.settings') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">{{ $t('profile.settingsDescription') }}</p>
      </UCard>

      <!-- Test Results Card -->
      <UCard 
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/25 transition-all duration-200 cursor-pointer group" 
        @click="navigateTo($localePath('/profile/tests'))"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('profile.testResults') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">{{ $t('profile.testResultsDescription') }}</p>
      </UCard>

      <!-- Payments Card -->
      <UCard 
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/25 transition-all duration-200 cursor-pointer group" 
        @click="navigateTo($localePath('/profile/payments'))"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-credit-card" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('profile.payments.title') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">{{ $t('profile.payments.description') }}</p>
      </UCard>

      <!-- Subscriptions Card -->
      <UCard 
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/25 transition-all duration-200 cursor-pointer group" 
        @click="navigateTo($localePath('/profile/subscriptions'))"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-star" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('profile.subscriptions.title') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">{{ $t('profile.subscriptions.description') }}</p>
        
        <!-- Subscription Status -->
        <div v-if="activeSubscriptions.length > 0" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('profile.subscriptions.active') }}</span>
            <UBadge color="success" variant="solid" class="text-xs">
              {{ activeSubscriptions.length }}
            </UBadge>
          </div>
          <div v-if="nextExpiry" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {{ $t('profile.subscriptions.expiryDate') }}: {{ formatDate(nextExpiry) }}
          </div>
        </div>
        <div v-else class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('profile.subscriptions.noSubscriptions') }}</span>
            <UBadge color="neutral" variant="solid" class="text-xs">
              0
            </UBadge>
          </div>
        </div>
      </UCard>

      <!-- Stats Card -->
      <UCard class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('profile.statistics') }}</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('profile.testsTaken') }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ testCount }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('profile.averageScore') }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ averageScore }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('profile.lastTest') }}</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ lastTestDate }}</span>
          </div>
        </div>
      </UCard>

      <!-- Admin Card (if admin) -->
      <UCard 
        v-if="isAdmin"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/25 transition-all duration-200 cursor-pointer group" 
        @click="navigateTo($localePath('/admin'))"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ $t('profile.adminPanel') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">{{ $t('profile.adminDescription') }}</p>
      </UCard>

      <!-- Sign Out Card -->
      <UCard 
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-gray-900/25 transition-all duration-200 cursor-pointer group hover:border-red-200 dark:hover:border-red-800" 
        @click="handleSignOut"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center group-hover:from-red-100 group-hover:to-red-200 dark:group-hover:from-red-900/50 dark:group-hover:to-red-800/50 transition-all duration-200">
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
          </div>
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-red-900 dark:group-hover:text-red-100 transition-colors">{{ $t('nav.signOut') }}</h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">{{ $t('profile.signOutDescription') }}</p>
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

const { user, isAdmin, signOut, profile } = await useAuth()
const localePath = useLocalePath()
const db = useFirestore()

// SEO: Prevent indexing of profile pages
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' },
    { property: 'og:robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'User profile - private area' }
  ]
})

// Mock data for now - you can replace with real data from Firestore
const testCount = ref(0)
const averageScore = ref(0)
const lastTestDate = ref('-')

// Subscription data
const activeSubscriptions = computed(() => {
  if (!profile.value?.subscriptions) return []
  const now = Date.now()
  return profile.value.subscriptions.filter((sub: any) => {
    const expiryDate = new Date(sub.expiryDate).getTime()
    return expiryDate > now
  })
})

const nextExpiry = computed(() => {
  if (activeSubscriptions.value.length === 0) return null
  const now = Date.now()
  const validSubscriptions = activeSubscriptions.value.filter((sub: any) => {
    const expiryDate = new Date(sub.expiryDate).getTime()
    return expiryDate > now
  })
  
  if (validSubscriptions.length === 0) return null
  
  // Find the subscription that expires next
  return validSubscriptions.reduce((next: number | null, sub: any) => {
    const expiryDate = new Date(sub.expiryDate).getTime()
    if (!next) return expiryDate
    return Math.min(next, expiryDate)
  }, null as number | null)
})

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString()
}

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