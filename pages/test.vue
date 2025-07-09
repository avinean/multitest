<template>
  <div class="flex flex-col"> 
    <div
v-if="!pending && !error && questions.length > 0" 
         class="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 min-w-[160px]">
      <div class="text-center">
        <div class="text-xs text-gray-500 mb-1">Time Remaining</div>
        <div class="text-lg font-bold" :class="timeRemainingClass">
          {{ formatTime(timeRemaining) }}
        </div>
        <div class="text-xs text-gray-400 mt-1">
          {{ Math.round((timeRemaining / TOTAL_TIME) * 100) }}% left
        </div>
        
        <hr class="my-2">
        <div class="flex flex-col items-center gap-2">
          <UButton
            v-if="!isPaused && canResume"
            size="xs"
            color="primary"
            variant="subtle"
            class="mx-auto"
            @click="showPauseWarning"
          >
            Pause Test
          </UButton>
          
          <template v-else-if="isPaused">
            <UButton
              size="xs"
              color="primary"
              variant="subtle"
              class="mx-auto"
              :disabled="!canResume"
              @click="resumeTest"
            >
              Resume
            </UButton>
            <div class="text-xs text-red-600 mt-1 text-center">
              <div>Can resume in:</div>
              <div class="font-semibold">{{ formatTime(timeUntilResume) }}</div>
            </div>
          </template>
          
          <!-- Start New Test Button -->
          <UButton
            size="xs"
            color="neutral"
            variant="outline"
            class="mx-auto"
            @click="showNewTestModal = true"
          >
            Start New Test
          </UButton>
        </div>
      </div>
    </div>

    <!-- Pause Warning Modal -->
    <UModal v-model:open="showPauseModal" title="Pause Test">
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-700">
            Are you sure you want to pause the test?
          </p>
          <div class="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p class="text-sm text-orange-800">
              <strong>Warning:</strong> Once paused, you must wait 30 minutes before you can resume the test. 
              This restriction prevents abuse of the pause feature.
            </p>
          </div>
        </div>
      </template>
      
      <template #footer>
        <div class="w-full flex justify-end gap-3">
          <UButton 
            color="neutral" 
            variant="outline"
            @click="showPauseModal = false"
          >
            Cancel
          </UButton>
          <UButton 
            color="primary"
            variant="subtle"
            @click="pauseTest"
          >
            Pause Test
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Start New Test Modal -->
    <UModal v-model:open="showNewTestModal" title="Start New Test">
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-700">
            Are you sure you want to start a completely new test?
          </p>
          <div class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-800">
              <strong>Warning:</strong> This will permanently delete all your current progress and answers. 
              You will start with fresh questions and a new 60-minute timer.
            </p>
          </div>
        </div>
      </template>
      
      <template #footer>
        <div class="w-full flex justify-end gap-3">
          <UButton 
            color="neutral" 
            variant="outline"
            @click="showNewTestModal = false"
          >
            Cancel
          </UButton>
          <UButton 
            color="error"
            @click="startNewTest"
          >
            Start New Test
          </UButton>
        </div>
      </template>
    </UModal>

    <div v-if="pending" class="flex-1 flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"/>
        <p class="text-lg">Loading test questions...</p>
      </div>
    </div>

    <div v-else-if="error" class="flex-1 flex justify-center items-center min-h-screen">
      <div class="max-w-md w-full p-8 bg-white border border-red-200 rounded-lg shadow-sm text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-red-800 mb-4">Error Loading Test</h2>
        <p class="text-red-600 mb-6">{{ error }}</p>
        <UButton color="red" @click="$router.go(0)">Reload Page</UButton>
      </div>
    </div>

    <div v-else-if="questions.length > 0" class="flex-1 flex flex-col">
      <div class="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div class="max-w-6xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Question Navigation</h3>
            <div class="text-sm">
              {{ answeredCount }} of {{ questions.length }} answered
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="(question, index) in questions"
              :key="question"
              class="w-8 h-8 rounded-lg border-2 flex items-center justify-center"
              :class="{
                'border-primary-500 bg-primary-100': index === currentQuestionIndex,
                'border-green-500 bg-green-100': userAnswers[index] !== undefined && index !== currentQuestionIndex,
                'border-gray-300 bg-gray-50 hover:bg-gray-100': userAnswers[index] === undefined && index !== currentQuestionIndex
              }"
              @click="goToQuestion(index)"
            >
              {{ index + 1 }}
            </button>
          </div>
          
          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-primary-500 bg-primary-100 rounded"/>
              <span>Current</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-green-500 bg-green-100 rounded"/>
              <span>Answered</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-gray-300 bg-gray-50 rounded"/>
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <div v-if="currentQuestion" class="max-w-4xl mx-auto">
          <QuestionViewer 
            v-model:user-answer="userAnswers[currentQuestionIndex]"
            :question="currentQuestion"
            mode="test"
            :question-index="currentQuestionIndex"
          />
        </div>
      </div>

      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div class="max-w-4xl mx-auto flex justify-between">
          <UButton 
            :disabled="currentQuestionIndex === 0" 
            color="neutral"
            variant="outline"
            @click="previousQuestion"
          >
            ← Previous
          </UButton>
          
          <UButton 
            color="primary"
            @click="nextQuestion"
          >
            {{ isLastQuestion ? 'Finish Test' : 'Next →' }}
          </UButton>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 flex justify-center items-center min-h-screen">
      <div class="max-w-md w-full p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
        <div class="text-gray-400 text-6xl mb-4">📝</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">No Test Available</h2>
        <p class="text-gray-600 mb-6">No published question groups were found to create a test.</p>
        <UButton @click="navigateTo('/')">Go to Home</UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { query, where, collection, getDocs, limit } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { onBeforeRouteLeave } from 'vue-router'

definePageMeta({
  ssr: false
})

useHead({
  title: 'English Proficiency Test'
})

const pending = ref(false)
const error = ref(null)

const TOTAL_TIME = 60 * 60 * 1000 // 60 minutes
const PAUSE_COOLDOWN = 30 * 60 * 1000 // 30 minutes
const timeRemaining = ref(TOTAL_TIME)
const testStartTime = ref(null)
const timerInterval = ref(null)
const testCompleted = ref(false)

// Pause state
const isPaused = ref(false)
const pausedAt = ref(null)
const resumeAllowedAt = ref(null)
const timeUntilResume = ref(0)
const showPauseModal = ref(false)
const showNewTestModal = ref(false)

const db = useFirestore()
const questions = ref([])
const userAnswers = reactive({})
const currentQuestionIndex = ref(0)

watch([questions, userAnswers, currentQuestionIndex, timeRemaining, testStartTime, isPaused, pausedAt, resumeAllowedAt], () => {
  sessionStorage.setItem('testData', JSON.stringify({
    questions: questions.value,
    userAnswers: userAnswers,
    currentQuestionIndex: currentQuestionIndex.value,
    timeRemaining: timeRemaining.value,
    testStartTime: testStartTime.value,
    isPaused: isPaused.value,
    pausedAt: pausedAt.value,
    resumeAllowedAt: resumeAllowedAt.value,
  }))
})

const fetchTestQuestions = async () => {
  try {
    pending.value = true
    error.value = null
    let allQuestions = []
    
    for (const { value } of questionGroupTypes) {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'question-groups'),
          where('type', '==', value),
          where('published', '==', true),
          limit(1)
        )
      )
      
      querySnapshot.docs.forEach(doc => {
        const groupData = doc.data()
        if (groupData.questions && groupData.questions.length > 0) {
          allQuestions = [...allQuestions, ...groupData.questions]
        }
      })
    }
    
    questions.value = allQuestions
    
  } catch (err) {
    console.error('Error fetching question groups:', err)
    error.value = err.message || 'Failed to load test questions'
  } finally {
    pending.value = false
  }
}

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)
const answeredCount = computed(() => Object.keys(userAnswers).length)

const nextQuestion = () => {
  if (isLastQuestion.value) {
    finishTest()
  } else {
    currentQuestionIndex.value++
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const goToQuestion = (index) => {
  if (index >= 0 && index < questions.value.length) {
    currentQuestionIndex.value = index
  }
}

const startTimer = () => {
  if (!testStartTime.value) {
    testStartTime.value = Date.now()
  }
  
  timerInterval.value = setInterval(() => {
    if (!isPaused.value) {
      const elapsed = Date.now() - testStartTime.value
      timeRemaining.value = Math.max(0, TOTAL_TIME - elapsed)
      
      if (timeRemaining.value <= 0) {
        timeExpired()
      }
    } else {
      // Update time until resume
      if (resumeAllowedAt.value) {
        timeUntilResume.value = Math.max(0, resumeAllowedAt.value - Date.now())
      }
    }
  }, 1000)
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const timeExpired = () => {
  stopTimer()
  finishTest()
}

const finishTest = () => {
  testCompleted.value = true
  stopTimer()
  sessionStorage.setItem('testData', JSON.stringify({
    questions: questions.value,
    userAnswers: userAnswers,
    currentQuestionIndex: currentQuestionIndex.value,
    timeRemaining: timeRemaining.value,
    testStartTime: testStartTime.value,
    completed: true
  }))
  
  navigateTo('/result')
}

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const timeRemainingClass = computed(() => {
  if (isPaused.value) return 'text-orange-600'
  const percentage = (timeRemaining.value / TOTAL_TIME) * 100
  if (percentage <= 10) return 'text-red-600'
  if (percentage <= 25) return 'text-orange-500'
  return 'text-green-600'
})

const canResume = computed(() => {
  if (!isPaused.value) return true
  if (!resumeAllowedAt.value) return false
  return Date.now() >= resumeAllowedAt.value
})

// Pause/Resume functions
const showPauseWarning = () => {
  showPauseModal.value = true
}

const pauseTest = () => {
  isPaused.value = true
  pausedAt.value = Date.now()
  resumeAllowedAt.value = Date.now() + PAUSE_COOLDOWN
  const elapsed = Date.now() - testStartTime.value
  testStartTime.value = Date.now() - elapsed
  
  showPauseModal.value = false
}

const resumeTest = () => {
  if (!canResume.value) return
  
  const pauseDuration = Date.now() - pausedAt.value
  testStartTime.value += pauseDuration
  
  isPaused.value = false
  pausedAt.value = null
  resumeAllowedAt.value = null
  timeUntilResume.value = 0
}

const startNewTest = () => {
  // Stop current timer
  stopTimer()
  
  // Clear all test data
  sessionStorage.removeItem('testData')
  
  // Reset all state
  questions.value = []
  Object.assign(userAnswers, {})
  currentQuestionIndex.value = 0
  timeRemaining.value = TOTAL_TIME
  testStartTime.value = null
  isPaused.value = false
  pausedAt.value = null
  resumeAllowedAt.value = null
  timeUntilResume.value = 0
  testCompleted.value = false
  
  // Close modal
  showNewTestModal.value = false
  
  // Fetch fresh questions and start new timer
  fetchTestQuestions().then(() => {
    if (questions.value.length > 0) {
      startTimer()
    }
  })
}

// Common function to auto-pause the test
const autoPauseTest = () => {
  if (!testCompleted.value && !isPaused.value) {
    // Automatically pause the test for 30 minutes
    isPaused.value = true
    pausedAt.value = Date.now()
    resumeAllowedAt.value = Date.now() + PAUSE_COOLDOWN
    
    // Adjust test start time to account for pause
    const elapsed = Date.now() - testStartTime.value
    testStartTime.value = Date.now() - elapsed
    
    // Save the paused state immediately
    sessionStorage.setItem('testData', JSON.stringify({
      questions: questions.value,
      userAnswers: userAnswers,
      currentQuestionIndex: currentQuestionIndex.value,
      timeRemaining: timeRemaining.value,
      testStartTime: testStartTime.value,
      isPaused: isPaused.value,
      pausedAt: pausedAt.value,
      resumeAllowedAt: resumeAllowedAt.value,
    }))
    
    return true // Indicates test was paused
  }
  return false // Test was not paused (already completed/paused)
}

// Handle browser events (close/refresh)
const handleNavigation = (event) => {
  if (autoPauseTest()) {
    event.returnValue = 'Test paused for 30 minutes. You can return and resume after the cooldown period.'
  }
}

// Handle SPA navigation (route changes)
onBeforeRouteLeave((to, from, next) => {
  autoPauseTest()
  next() // Allow navigation to proceed
})

onMounted(() => {
  // Add beforeunload event listener to auto-pause on navigation
  window.addEventListener('beforeunload', handleNavigation)
  
  let testData
  try {
    testData = JSON.parse(sessionStorage.getItem('testData'))
  } catch {
    // Ignore parsing errors, will fetch fresh questions
  }

  if (testData && !testData.completed) {
    // Resume existing test
    questions.value = testData.questions
    Object.assign(userAnswers, testData.userAnswers)
    currentQuestionIndex.value = testData.currentQuestionIndex
    
    // Restore pause state
    if (testData.isPaused) {
      isPaused.value = testData.isPaused
      pausedAt.value = testData.pausedAt
      resumeAllowedAt.value = testData.resumeAllowedAt
    }
    
    if (testData.testStartTime) {
      testStartTime.value = testData.testStartTime
      
      if (testData.timeRemaining !== undefined) {
        timeRemaining.value = testData.timeRemaining
      } else {
        const elapsed = Date.now() - testData.testStartTime
        timeRemaining.value = Math.max(0, TOTAL_TIME - elapsed)
      }
      
      if (timeRemaining.value > 0) {
        startTimer()
      } else {
        timeExpired()
      }
    } else {
      startTimer()
    }
  } else {
    // Fetch new questions and start timer
    fetchTestQuestions().then(() => {
      if (questions.value.length > 0) {
        startTimer()
      }
    })
  }
})

onUnmounted(() => {
  stopTimer()
  window.removeEventListener('beforeunload', handleNavigation)
})
</script> 