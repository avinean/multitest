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

    <div v-else-if="data.questions.length > 0" class="flex-1 flex flex-col">
      <div class="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div class="max-w-6xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Question Navigation</h3>
            <div class="text-sm">
              {{ answeredCount }} of {{ data.questions.length }} answered
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="(question, index) in data.questions"
              :key="index"
              class="w-8 h-8 rounded-lg border-2 flex items-center justify-center"
              :class="{
                'border-primary-500 bg-primary-100': index === currentQuestionIndex,
                'border-green-500 bg-green-100': isQuestionAnswered(index) && index !== currentQuestionIndex,
                'border-gray-300 bg-gray-50 hover:bg-gray-100': !isQuestionAnswered(index) && index !== currentQuestionIndex
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
          <div v-if="currentQuestion.title || currentQuestion.subtitle">
            <h2 v-if="currentQuestion.title" class="text-2xl font-semibold mb-2">
              {{ currentQuestion.title }}
            </h2>
            <h3 v-if="currentQuestion.subtitle" class="text-lg">
              {{ currentQuestion.subtitle }}
            </h3>
          </div>
          
          <div v-if="currentQuestion.imageUrl" class="text-center">
            <img
              :src="currentQuestion.imageUrl" 
              :alt="currentQuestion.title" 
              class="max-w-full h-auto rounded-lg shadow-lg mx-auto"
            >
          </div>

          <div>
            <div class="text-lg font-medium mb-6 prose prose-lg max-w-none" v-html="currentQuestion.text"/>
          
            <div class="space-y-3">
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
  </div>
</template>

<script setup>
import { doc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'

useHead({
  title: 'English Proficiency Test'
})

const currentQuestionIndex = ref(0)
const userAnswers = ref({})

// Fetch test data directly using useDocument
const db = useFirestore()
const { data, pending, error } = useDocument(
  doc(db, 'tests', 'combined-test')
)
const currentQuestion = computed(() => data.value.questions[currentQuestionIndex.value])
const isLastQuestion = computed(() =>  currentQuestionIndex.value === data.value.questions.length - 1)
const answeredCount = computed(() => Object.keys(userAnswers.value).length)

const isQuestionAnswered = (questionIndex) => userAnswers.value[questionIndex] !== undefined

const nextQuestion = () => {
  if (isLastQuestion.value) {
    const resultsData = {
      userAnswers: userAnswers.value,
      totalQuestions: data.value.questions.length
    }
    localStorage.setItem('testResults', JSON.stringify(resultsData))
    
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
  if (index >= 0 && index < data.value.questions.length) {
    currentQuestionIndex.value = index
  }
}
</script> 