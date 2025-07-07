<template>
  <div class="flex flex-col"> 
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

    <div v-else-if="questions && questions.length > 0" class="flex-1 flex flex-col">
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
              :key="index"
              class="w-8 h-8 rounded-lg border-2 flex items-center justify-center"
              :class="{
                'border-primary-500 bg-primary-100': index === currentQuestionIndex,
                'border-green-500 bg-green-100': userAnswers[index] && index !== currentQuestionIndex,
                'border-gray-300 bg-gray-50 hover:bg-gray-100': !userAnswers[index] && index !== currentQuestionIndex
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
        <div v-if="currentQuestion" class="max-w-4xl mx-auto space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-800">
              Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
            </h2>
            <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {{ currentQuestion.groupType }}
            </div>
          </div>
          
          <div v-if="currentQuestion.imageUrl" class="text-center">
            <img
              :src="currentQuestion.imageUrl" 
              :alt="`Question ${currentQuestionIndex + 1} image`" 
              class="max-w-full h-auto rounded-lg shadow-lg mx-auto"
            >
          </div>

          <div>
            <div v-if="currentQuestion.text" class="text-lg font-medium mb-6 prose prose-lg max-w-none whitespace-pre-wrap">
              {{ currentQuestion.text }}
            </div>
            
            <div v-if="currentQuestion.question" class="text-lg font-medium mb-6 text-gray-800">
              {{ currentQuestion.question }}
            </div>
          
            <div v-if="currentQuestion.options && currentQuestion.options.length > 0" class="space-y-3">
              <label 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                class="flex items-center p-4 bg-gray-50 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100"
                :class="{
                  'border-primary-500 bg-primary-50': userAnswers[currentQuestionIndex] === index,
                  'border-gray-200': userAnswers[currentQuestionIndex] !== index
                }"
              >
                <input
                  v-model="userAnswers[currentQuestionIndex]"
                  type="radio"
                  :name="`question-${currentQuestionIndex}`"
                  :value="index"
                  class="mr-3"
                >
                <span class="flex-1">{{ option }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div class="max-w-4xl mx-auto flex justify-between">
          <UButton 
            :disabled="currentQuestionIndex === 0" 
            color="gray"
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

useHead({
  title: 'English Proficiency Test'
})

const currentQuestionIndex = ref(0)
const userAnswers = ref({})
const pending = ref(true)
const error = ref(null)
const questions = ref([])

const db = useFirestore()

// Fetch question groups and combine their questions
const fetchTestQuestions = async () => {
  try {
    pending.value = true
    error.value = null
    
    const questionTypes = [
      { type: 'image', count: 1 },
      { type: 'long_text', count: 1 },
      { type: 'short_text', count: 1 },
      { type: 'blanks_8', count: 1 },
      { type: 'blanks_4', count: 2 }
    ]
    
    let allQuestions = []
    
    for (const { type, count } of questionTypes) {
      // Fetch published question groups of this type
      const querySnapshot = await getDocs(
        query(
          collection(db, 'question-groups'),
          where('type', '==', type),
          where('published', '==', true),
          limit(count)
        )
      )
      
      querySnapshot.docs.forEach(doc => {
        const groupData = doc.data()
        if (groupData.questions && groupData.questions.length > 0) {
          // Add questions from this group to the test
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

// Fetch questions on component mount
await fetchTestQuestions()

// Store questions in sessionStorage when fetched
watch(questions, (newQuestions) => {
  if (newQuestions && newQuestions.length > 0) {
    const testData = {
      questions: newQuestions,
      userAnswers: {},
      startTime: new Date().toISOString()
    }
    sessionStorage.setItem('testData', JSON.stringify(testData))
  }
}, { immediate: true })

// Watch for answer changes and update sessionStorage
watch(userAnswers, (newAnswers) => {
  const testData = JSON.parse(sessionStorage.getItem('testData') || '{}')
  if (testData.questions) {
    testData.userAnswers = newAnswers
    sessionStorage.setItem('testData', JSON.stringify(testData))
  }
}, { deep: true })

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)
const answeredCount = computed(() => Object.keys(userAnswers.value).length)

const nextQuestion = () => {
  if (isLastQuestion.value) {
    // Update sessionStorage with final completion time
    const testData = JSON.parse(sessionStorage.getItem('testData') || '{}')
    testData.completedTime = new Date().toISOString()
    sessionStorage.setItem('testData', JSON.stringify(testData))
    
    navigateTo('/result')
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
</script> 