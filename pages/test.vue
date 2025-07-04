<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div class="w-10 h-10 border-4 border-gray-200 rounded-full animate-spin mb-4"/>
      <p>Loading test questions...</p>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <UCard class="max-w-md">
        <template #header>
          <h2 class="text-xl font-semibold">Error Loading Test</h2>
        </template>
        <p class="mb-4">{{ error }}</p>
        <UButton color="primary" @click="fetchTestData">Retry</UButton>
      </UCard>
    </div>

    <div v-else-if="testComplete" class="flex justify-center items-center min-h-[80vh]">
      <UCard class="max-w-2xl w-full text-center">
        <template #header>
          <h1 class="text-3xl font-bold">🎉 Test Complete!</h1>
        </template>
        
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

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton to="/" color="gray" variant="outline">Back to Home</UButton>
          <UButton color="primary" @click="restartTest">Restart Test</UButton>
        </div>
      </UCard>
    </div>

    <div v-else class="max-w-4xl mx-auto">
      <UCard class="mb-8">
        <div class="space-y-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: progressPercentage + '%' }"
            />
          </div>
          <p class="text-center">
            Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
          </p>
        </div>
      </UCard>

      <UCard v-if="currentQuestion" class="mb-8">
        <template #header>
          <div v-if="currentTest.title || currentTest.subtitle">
            <h2 v-if="currentTest.title" class="text-2xl font-semibold mb-2">
              {{ currentTest.title }}
            </h2>
            <h3 v-if="currentTest.subtitle" class="text-lg">
              {{ currentTest.subtitle }}
            </h3>
          </div>
        </template>

        <div class="space-y-6">
          <div v-if="currentTest.imageUrl && currentTest.type === 1" class="text-center">
            <img
:src="currentTest.imageUrl" :alt="currentTest.title" 
                 class="max-w-full h-auto rounded-lg shadow-lg mx-auto" >
          </div>

          <div v-if="currentTest.text" class="bg-gray-50 p-6 rounded-lg">
            <p class="leading-relaxed" v-html="formatText(currentTest.text)"/>
          </div>

          <div>
            <h4 class="text-lg font-medium mb-6">{{ currentQuestion.text }}</h4>
          
            <div class="space-y-3">
              <label 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                class="flex items-center p-4 bg-gray-50 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100"
                :class="{
                  'border-primary-500 bg-primary-50': userAnswers[currentQuestion.questionId] === index,
                  'border-gray-200': userAnswers[currentQuestion.questionId] !== index
                }"
              >
                <input
                  v-model="userAnswers[currentQuestion.questionId]"
                  type="radio"
                  :name="currentQuestion.questionId"
                  :value="index"
                  class="mr-3"
                >
                <span class="flex-1">{{ option }}</span>
              </label>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton 
              :disabled="currentQuestionIndex === 0" 
              color="gray"
              variant="outline"
              @click="previousQuestion"
            >
              ← Previous
            </UButton>
            
            <UButton 
              :disabled="!isCurrentQuestionAnswered"
              color="primary"
              @click="nextQuestion"
            >
              {{ isLastQuestion ? 'Finish Test' : 'Next →' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'English Proficiency Test'
})

const loading = ref(true)
const error = ref(null)
const testData = ref([])
const currentQuestionIndex = ref(0)
const userAnswers = ref({})
const testComplete = ref(false)

const allQuestions = computed(() => {
  const questions = []
  testData.value.forEach(test => {
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

const totalQuestions = computed(() => allQuestions.value.length)

const currentQuestion = computed(() => {
  return allQuestions.value[currentQuestionIndex.value]
})

const currentTest = computed(() => {
  return currentQuestion.value?.test || {}
})

const progressPercentage = computed(() => {
  return totalQuestions.value > 0 ? (currentQuestionIndex.value / totalQuestions.value) * 100 : 0
})

const isCurrentQuestionAnswered = computed(() => {
  return currentQuestion.value && userAnswers.value[currentQuestion.value.questionId] !== undefined
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === totalQuestions.value - 1
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

async function fetchTestData() {
  try {
    loading.value = true
    error.value = null
    const response = await $fetch('/api/english-test')
    testData.value = response
  } catch (err) {
    console.error('Error loading test data:', err)
    error.value = 'Failed to load test data. Please try again.'
  } finally {
    loading.value = false
  }
}

function formatText(text) {
  return text.replace(/\[\[(\d+)\]\]/g, '<span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[$1]</span>')
}

function nextQuestion() {
  if (isLastQuestion.value) {
    testComplete.value = true
  } else {
    currentQuestionIndex.value++
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function restartTest() {
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  testComplete.value = false
}

onMounted(fetchTestData)
</script> 