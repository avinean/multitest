<template>
  <div class="flex-1 flex flex-col py-4 justify-center items-center min-h-screen">
    <div v-if="questions && questions.length > 0" class="max-w-2xl w-full p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
      <h1 class="text-3xl font-bold mb-8">🎉 Test Complete!</h1>
      
      <div class="my-8">
        <div class="inline-flex items-center justify-center w-32 h-32 border-8 border-primary-500 rounded-full mb-4">
          <span class="text-3xl font-bold">{{ score }}</span>
          <span class="text-xl">/ {{ questions.length }}</span>
        </div>
        <p class="text-2xl font-semibold">{{ Math.round((score / questions.length) * 100) }}%</p>
      </div>
    </div>

    <div v-if="questions && questions.length > 0" class="max-w-4xl mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold mb-6">Question Review</h2>
      
      <div class="space-y-8">
        <div v-for="(question, index) in questions" :key="index" class="border-b border-gray-200 pb-6 last:border-b-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Question {{ index + 1 }}</h3>
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
                  userAnswers[index] === undefined ? 'No Answer' :
                  userAnswers[index] === (question.correct ?? question.correctAnswerIndex) ? 'Correct' : 'Incorrect' 
                }}
              </div>
            </div>
          </div>

          <div v-if="question.imageUrl" class="mb-4">
            <img :src="question.imageUrl" :alt="question.text || 'Question image'" class="max-w-80 mx-auto rounded-lg shadow-lg">
          </div>

          <div v-if="question.text" class="mb-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-800">{{ question.text }}</p>
          </div>

          <p class="text-gray-800 mb-4 font-medium">{{ question.question }}</p>

          <div v-if="question.options && question.options.length > 0" class="space-y-1 mb-4">
            <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center gap-1 flex-1">
              <span class="w-8 h-8 bg-gray-200 flex items-center justify-center">
                {{ String.fromCharCode(65 + optionIndex) }}
              </span>
              <span class="flex-1">{{ option }}</span>
            </div>
          </div>
          
          <div>
            <div class="font-semibold mb-2">Answer Review</div>
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
            <span class="text-yellow-800 text-sm font-medium">No answer selected</span>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <UButton size="lg" @click="navigateTo('/')">
          Take Another Test
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

// Load test data and clear sessionStorage on mount
onMounted(() => {
  try {
    const testData = JSON.parse(sessionStorage.getItem('testData'))
    if (testData.questions && testData.questions.length > 0) {
      questions.value = testData.questions
      userAnswers.value = testData.userAnswers
      
      sessionStorage.removeItem('testData')
    } else {
      navigateTo('/')
    }
  } catch (err) {
    console.error('Error loading test data:', err)
    navigateTo('/')
  }
})

const score = computed(() =>
  questions.value.reduce((correct, question, index) => 
    userAnswers.value[index] !== undefined && userAnswers.value[index] === question.correct 
      ? correct + 1 
      : correct
  , 0))
</script> 