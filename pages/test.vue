<template>
  <div class="flex flex-col">
    <!-- Test Interface -->
    <div class="flex-1 flex flex-col">
      <!-- Sticky Top: Question Navigation -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div class="max-w-6xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Question Navigation</h3>
            <div class="text-sm">
              {{ answeredCount }} of {{ totalQuestions }} answered
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="(question, index) in allQuestions"
              :key="question.questionId"
              class="w-8 h-8 rounded-lg border-2 flex items-center justify-center"
              :class="{
                'border-primary-500 bg-primary-100': index === currentQuestionIndex,
                'border-green-500 bg-green-100': isQuestionAnswered(question.questionId) && index !== currentQuestionIndex,
                'border-gray-300 bg-gray-50 hover:bg-gray-100': !isQuestionAnswered(question.questionId) && index !== currentQuestionIndex
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

      <!-- Scrollable Middle: Question Content -->
      <div class="flex-1 overflow-auto p-4">
        <div v-if="currentQuestion" class="max-w-4xl mx-auto space-y-6">
          <div v-if="currentTest.title || currentTest.subtitle">
            <h2 v-if="currentTest.title" class="text-2xl font-semibold mb-2">
              {{ currentTest.title }}
            </h2>
            <h3 v-if="currentTest.subtitle" class="text-lg">
              {{ currentTest.subtitle }}
            </h3>
          </div>
          
          <div v-if="currentTest.imageUrl && currentTest.type === 1" class="text-center">
            <img
              :src="currentTest.imageUrl" 
              :alt="currentTest.title" 
              class="max-w-full h-auto rounded-lg shadow-lg mx-auto"
            >
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
      </div>

      <!-- Sticky Bottom: Navigation Buttons -->
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
  </div>
</template>

<script setup>
import testData from 'assets/mock_dmt_english_test.json'

useHead({
  title: 'English Proficiency Test'
})

const currentQuestionIndex = ref(0)
const userAnswers = ref({})

// Reset test state when page loads
onMounted(() => {
  currentQuestionIndex.value = 0
  userAnswers.value = {}
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

const totalQuestions = computed(() => allQuestions.value.length)

const currentQuestion = computed(() => {
  return allQuestions.value[currentQuestionIndex.value]
})

const currentTest = computed(() => {
  return currentQuestion.value?.test || {}
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === totalQuestions.value - 1
})



const answeredCount = computed(() => {
  return allQuestions.value.filter(question => 
    userAnswers.value[question.questionId] !== undefined
  ).length
})

function formatText(text) {
  return text.replace(/\[\[(\d+)\]\]/g, '<span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[$1]</span>')
}

function nextQuestion() {
  if (isLastQuestion.value) {
    // Save results to localStorage for the results page
    const resultsData = {
      userAnswers: userAnswers.value,
      totalQuestions: totalQuestions.value
    }
    localStorage.setItem('testResults', JSON.stringify(resultsData))
    
    // Navigate to results page
    navigateTo('/result')
  } else {
    currentQuestionIndex.value++
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function goToQuestion(index) {
  if (index >= 0 && index < totalQuestions.value) {
    currentQuestionIndex.value = index
  }
}

function isQuestionAnswered(questionId) {
  return userAnswers.value[questionId] !== undefined
}
</script> 