<template>
  <div class="flex-1 flex flex-col py-4 justify-center items-center min-h-screen">
    <div class="max-w-2xl w-full p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
      <h1 class="text-3xl font-bold mb-8">🎉 Test Complete!</h1>
      
      <div class="my-8">
        <div class="inline-flex items-center justify-center w-32 h-32 border-8 border-primary-500 rounded-full mb-4">
          <span class="text-3xl font-bold">{{ score }}</span>
          <span class="text-xl">/ {{ totalQuestions }}</span>
        </div>
        <p class="text-2xl font-semibold">{{ Math.round((score / totalQuestions) * 100) }}%</p>
      </div>
      
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">Results by Question Type:</h3>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div v-for="(result, type) in scoreByType" :key="type" class="p-4 bg-gray-100 rounded-lg text-center">
            <span class="block text-sm mb-2">Type {{ type }}</span>
            <span class="text-lg font-semibold">{{ result.correct }}/{{ result.total }}</span>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <UButton color="primary" @click="restartTest">Restart Test</UButton>
      </div>
    </div>

    <!-- Detailed Question Review -->
    <div class="max-w-4xl mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold mb-6">Question Review</h2>
      
      <div class="space-y-8">
        <div v-for="(question, index) in allQuestions" :key="question.questionId" class="border-b border-gray-200 pb-6 last:border-b-0">
          <!-- Question Header -->
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Question {{ index + 1 }}</h3>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">Type {{ question.testType }}</span>
              <div 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="isAnswerCorrect(question) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ isAnswerCorrect(question) ? 'Correct' : 'Incorrect' }}
              </div>
            </div>
          </div>

          <!-- Test Context (if available) -->
          <div v-if="question.test?.title || question.test?.subtitle || question.test?.text" class="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 v-if="question.test.title" class="font-semibold mb-2">{{ question.test.title }}</h4>
            <h5 v-if="question.test.subtitle" class="text-sm text-gray-600 mb-2">{{ question.test.subtitle }}</h5>
            <div v-if="question.test.text" class="text-sm" v-html="formatText(question.test.text)"/>
          </div>

          <!-- Question Text -->
          <p class="text-gray-800 mb-4 font-medium">{{ question.text }}</p>

          <!-- Answer Options -->
          <div class="space-y-2">
            <div 
              v-for="(option, optionIndex) in question.options" 
              :key="optionIndex"
              class="flex items-center p-3 rounded-lg border-2"
              :class="{
                'border-green-500 bg-green-50': optionIndex === question.correctAnswerIndex,
                'border-red-500 bg-red-50': optionIndex === userAnswers[question.questionId] && optionIndex !== question.correctAnswerIndex,
                'border-gray-200 bg-gray-50': optionIndex !== question.correctAnswerIndex && optionIndex !== userAnswers[question.questionId]
              }"
            >
              <div class="flex items-center justify-between w-full">
                <span class="flex-1">{{ option }}</span>
                <div class="flex items-center gap-2 ml-4">
                  <!-- User's Answer Indicator -->
                  <span 
                    v-if="optionIndex === userAnswers[question.questionId]"
                    class="px-2 py-1 text-xs rounded-full"
                    :class="optionIndex === question.correctAnswerIndex ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'"
                  >
                    Your Answer
                  </span>
                  <!-- Correct Answer Indicator -->
                  <span 
                    v-if="optionIndex === question.correctAnswerIndex"
                    class="px-2 py-1 text-xs bg-green-200 text-green-800 rounded-full"
                  >
                    Correct
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- No Answer Selected -->
          <div v-if="userAnswers[question.questionId] === undefined" class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span class="text-yellow-800 text-sm font-medium">No answer selected</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import testData from 'assets/mock_dmt_english_test.json'

useHead({
  title: 'Test Results - English Proficiency Test'
})

// Get results data from query parameters or localStorage
const route = useRoute()
const userAnswers = ref({})
const totalQuestions = ref(0)

// Load test results data
onMounted(() => {
  // Try to get data from localStorage first (more reliable for page refreshes)
  const savedResults = localStorage.getItem('testResults')
  if (savedResults) {
    const resultsData = JSON.parse(savedResults)
    userAnswers.value = resultsData.userAnswers
    totalQuestions.value = resultsData.totalQuestions
  } else {
    // Fallback to query parameters
    if (route.query.results) {
      const resultsData = JSON.parse(decodeURIComponent(route.query.results))
      userAnswers.value = resultsData.userAnswers
      totalQuestions.value = resultsData.totalQuestions
    } else {
      // No results data available, redirect to test
      navigateTo('/test')
    }
  }
})

const allQuestions = computed(() => {
  const questions = []
  testData.forEach(test => {
    test.questions.forEach(question => {
      questions.push({
        ...question,
        testId: test.id,
        testType: test.type,
        test: test
      })
    })
  })
  return questions
})

const score = computed(() => {
  let correct = 0
  allQuestions.value.forEach(question => {
    if (userAnswers.value[question.questionId] === question.correctAnswerIndex) {
      correct++
    }
  })
  return correct
})

const scoreByType = computed(() => {
  const breakdown = {}
  allQuestions.value.forEach(question => {
    const type = question.testType
    if (!breakdown[type]) {
      breakdown[type] = { correct: 0, total: 0 }
    }
    breakdown[type].total++
    if (userAnswers.value[question.questionId] === question.correctAnswerIndex) {
      breakdown[type].correct++
    }
  })
  return breakdown
})

function formatText(text) {
  return text.replace(/\[\[(\d+)\]\]/g, '<span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[$1]</span>')
}

function isAnswerCorrect(question) {
  return userAnswers.value[question.questionId] === question.correctAnswerIndex
}

function restartTest() {
  // Clear saved results
  localStorage.removeItem('testResults')
  // Navigate back to test page
  navigateTo('/test')
}
</script> 