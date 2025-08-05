<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('profile.testResults') }}</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">{{ $t('profile.testResultsDescription') }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"/>
        <p class="text-lg text-gray-600 dark:text-gray-300">{{ $t('common.loading') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <div class="text-red-500 dark:text-red-400 text-4xl mb-4">⚠️</div>
      <h2 class="text-xl font-bold text-red-800 dark:text-red-200 mb-2">{{ $t('common.error') }}</h2>
      <p class="text-red-600 dark:text-red-300">{{ error }}</p>
    </div>

    <!-- Results Content -->
    <div v-else>
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <UCard class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ results?.length || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('profile.testsTaken') }}</div>
          </div>
        </UCard>
        
        <UCard class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ averageScore }}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('profile.averageScore') }}</div>
          </div>
        </UCard>
        
        <UCard class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ bestScore }}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('profile.bestScore') }}</div>
          </div>
        </UCard>
        
        <UCard class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalTime }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ $t('profile.totalTime') }}</div>
          </div>
        </UCard>
      </div>

      <!-- Results Table -->
      <div v-if="sortedResults.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('profile.testDate') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('profile.score') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('profile.percentage') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('profile.timeTaken') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('profile.questions') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ $t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="result in sortedResults" :key="result.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <NuxtTime :datetime="result.createdAt" month="short" day="numeric" year="numeric" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ result.score || 0 }}/{{ result.totalQuestions || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge
                    :color="getScoreColor(result.percentage || 0)"
                    variant="solid"
                    class="text-xs"
                  >
                    {{ result.percentage || 0 }}%
                  </UBadge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ formatTime(result.timeTaken || 0) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ result.totalQuestions || 0 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <UButton
                    @click="viewResult(result)"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-eye"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
                  >
                    {{ $t('common.view') }}
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{{ $t('profile.noTestResults') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('profile.noTestResultsMessage') }}</p>
        <UButton :to="$localePath('/test')" color="primary">
          {{ $t('profile.takeFirstTest') }}
        </UButton>
      </div>
    </div>

    <!-- Result Details Modal -->
    <ModalTestResult
      v-model="showResultModal" 
      :result="selectedResult" 
    />
  </div>
</template>

<script setup lang="ts">
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

definePageMeta({
  layout: 'default'
})

const { user } = await useAuth()
const db = useFirestore()

// SEO: Prevent indexing of profile pages
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' },
    { property: 'og:robots', content: 'noindex, nofollow' },
    { name: 'description', content: 'User test results - private area' }
  ]
})

// Modal state
const showResultModal = ref(false)
const selectedResult = ref<TestResult | null>(null)

const { data: results, pending, error } = await useAsyncData(
  'user-test-results',
  async () => {
    const testResultsRef = collection(db, 'test-results')
    const q = query(
      testResultsRef, 
      where('email', '==', user.value?.email),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TestResult[]
  }
)

// Computed properties
const sortedResults = computed(() => {
  if (!results.value) return []
  return [...results.value].sort((a, b) => b.createdAt - a.createdAt)
})

// Statistics
const averageScore = computed(() => {
  if (!results.value || results.value.length === 0) return 0
  const total = results.value.reduce((sum, result) => sum + (result.percentage || 0), 0)
  return Math.round(total / results.value.length)
})
const bestScore = computed(() => {
  if (!results.value || results.value.length === 0) return 0
  return Math.max(...results.value.map(result => result.percentage || 0))
})
const totalTime = computed(() => {
  if (!results.value) return '-'
  const totalMs = results.value.reduce((sum, result) => sum + (result.timeTaken || 0), 0)
  return formatTime(totalMs)
})

// Methods
const formatTime = (milliseconds: number) => {
  if (!milliseconds) return '-'
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

const getScoreColor = (percentage: number) => {
  if (percentage >= 80) return 'success'
  if (percentage >= 60) return 'warning'
  return 'error'
}

const viewResult = (result: TestResult) => {
  selectedResult.value = result
  showResultModal.value = true
}
</script>