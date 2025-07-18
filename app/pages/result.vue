<template>
  <div class="flex-1 flex flex-col py-4 justify-center items-center min-h-screen">
    <div v-if="questions && questions.length > 0" class="max-w-2xl w-full p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
      <h1 class="text-3xl font-bold mb-4">{{ $t('result.title') }}</h1>
      <p v-if="userInfo?.name" class="text-lg text-gray-600 mb-6">
        {{ $t('result.greatJob') }}, {{ userInfo.name }}!
      </p>
      <p v-else-if="userInfo?.email" class="text-lg text-gray-600 mb-6">
        {{ $t('result.greatJob') }}! {{ $t('result.resultsSent') }} {{ userInfo.email }}
      </p>
      
      <div class="my-8">
        <div class="inline-flex items-center justify-center w-32 h-32 border-8 border-primary-500 rounded-full mb-4">
          <span class="text-3xl font-bold">{{ score }}</span>
          <span class="text-xl">/ {{ questions.length }}</span>
        </div>
        <p class="text-2xl font-semibold">{{ Math.round((score / questions.length) * 100) }}%</p>
        
        <!-- Time Spent Display -->
        <div v-if="timeSpent" class="mt-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">{{ $t('result.timeSpent') }}</p>
          <p class="text-lg font-semibold">{{ formatTimeSpent(timeSpent) }}</p>
        </div>
      </div>
    </div>

    <div v-if="questions && questions.length > 0" class="max-w-4xl mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold mb-6">{{ $t('result.questionReview') }}</h2>
      
              <div class="space-y-8">
          <div v-for="(question, index) in questions" :key="index" class="border-b border-gray-200 pb-6 last:border-b-0">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">{{ $t('test.question') }} {{ index + 1 }}</h3>
              <div class="flex items-center gap-2">
                <div 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-green-100 text-green-800': userAnswers[index] !== undefined && userAnswers[index] === (question.correct ?? question.correctAnswerIndex),
                    'bg-red-100 text-red-800': userAnswers[index] !== undefined && userAnswers[index] !== (question.correct ?? question.correctAnswerIndex),
                    'bg-gray-100 text-gray-800': userAnswers[index] === undefined
                  }"
                >
                  {{ 
                    userAnswers[index] === undefined ? $t('result.noAnswer') :
                    userAnswers[index] === (question.correct ?? question.correctAnswerIndex) ? $t('result.correct') : $t('result.incorrect') 
                  }}
                </div>
              </div>
            </div>

          <div v-if="question.imageUrl" class="mb-4">
            <img :src="question.imageUrl" :alt="question.text || 'Question image'" class="max-w-80 mx-auto rounded-lg shadow-lg">
          </div>

          <div v-if="question.text" class="mb-4 p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none" v-html="question.text" />

          <div class="mb-4 font-medium prose prose-sm max-w-none" v-html="question.question" />

          <div v-if="question.options && question.options.length > 0" class="space-y-1 mb-4">
            <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center gap-1 flex-1">
              <span class="w-8 h-8 bg-gray-200 flex items-center justify-center">
                {{ String.fromCharCode(65 + optionIndex) }}
              </span>
              <span class="flex-1">{{ option }}</span>
            </div>
          </div>
          
          <div>
            <div class="font-semibold mb-2">{{ $t('result.answerReview') }}</div>
            <div class="flex items-center gap-2">
              <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex flex-col gap-1 items-center">
                <span class="text-sm">
                  {{ String.fromCharCode(65 + optionIndex) }}
                </span>
                <div
                  class="w-8 h-8 border-2 rounded flex items-center justify-center"
                  :class="{
                    'bg-green-500 border-green-500 text-white': optionIndex === (question.correct ?? question.correctAnswerIndex),
                    'bg-red-500 border-red-500 text-white': userAnswers[index] === optionIndex && optionIndex !== (question.correct ?? question.correctAnswerIndex),
                    'bg-gray-100 border-gray-400': optionIndex !== (question.correct ?? question.correctAnswerIndex) && userAnswers[index] !== optionIndex
                  }"
                >
                  <span v-if="optionIndex === (question.correct ?? question.correctAnswerIndex)" class="text-white font-bold">✓</span>
                  <span v-else-if="userAnswers[index] === optionIndex && optionIndex !== (question.correct ?? question.correctAnswerIndex)" class="text-white font-bold">✗</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="userAnswers[index] === undefined" class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span class="text-yellow-800 text-sm font-medium">{{ $t('result.noAnswerSelected') }}</span>
          </div>

          <!-- Explanation -->
          <div v-if="question.explanation" class="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div class="flex items-start gap-2">
              <div class="text-amber-600 mt-0.5">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-medium text-amber-800 mb-1">{{ $t('result.explanation') || 'Explanation' }}</h4>
                <div class="text-sm text-amber-700 prose prose-sm max-w-none" v-html="question.explanation"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <UButton size="lg" @click="navigateTo($localePath('/'))">
          {{ $t('result.retakeTest') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  ssr: false
})

useHead({
  title: 'Test Results - English Proficiency Test'
})

const questions = ref([])
const userAnswers = ref({})
const userInfo = ref(null)
const timeSpent = ref(null)
const localePath = useLocalePath()

// Load test data and user info on mount
onMounted(() => {
  try {
    // Load test data
    const testData = JSON.parse(sessionStorage.getItem('testData'))
    if (testData.questions && testData.questions.length > 0) {
      questions.value = testData.questions
      userAnswers.value = testData.userAnswers
      
      // Calculate time spent
      calculateTimeSpent(testData)
      
      sessionStorage.removeItem('testData')
    } else {
      navigateTo(localePath('/'))
      return
    }
    
    // Load user info
    const storedUserInfo = sessionStorage.getItem('userInfo')
    if (storedUserInfo) {
      userInfo.value = JSON.parse(storedUserInfo)
    }
  } catch (err) {
    console.error('Error loading test data:', err)
    navigateTo(localePath('/'))
  }
})

const score = computed(() =>
  questions.value.reduce((correct, question, index) => 
    userAnswers.value[index] !== undefined && userAnswers.value[index] === question.correct 
      ? correct + 1 
      : correct
  , 0))

const calculateTimeSpent = (testData) => {
  try {
    const userInfoData = JSON.parse(sessionStorage.getItem('userInfo'))
    if (!userInfoData?.startTime) return

    const startTime = new Date(userInfoData.startTime).getTime()
    const endTime = Date.now()
    
    // Calculate total elapsed time
    let totalElapsed = endTime - startTime
    
    // Subtract pause time if any
    if (testData.pausedAt && testData.resumeAllowedAt) {
      // If test was completed while paused, subtract the pause duration
      const pauseDuration = testData.resumeAllowedAt - testData.pausedAt
      totalElapsed -= pauseDuration
    }
    
    // Ensure we don't show negative time
    timeSpent.value = Math.max(0, totalElapsed)
  } catch (err) {
    console.error('Error calculating time spent:', err)
    timeSpent.value = null
  }
}

const formatTimeSpent = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}
</script> 