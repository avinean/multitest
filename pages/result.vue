<template>
  <div class="flex-1 flex flex-col py-4 justify-center items-center min-h-screen">
    <div v-if="error" class="max-w-md w-full p-8 bg-white border border-red-200 rounded-lg shadow-sm text-center">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-red-800 mb-4">Error Loading Results</h2>
      <p class="text-red-600 mb-6">{{ error }}</p>
      <UButton color="red" @click="$router.go(0)">Reload Page</UButton>
    </div>

    <div v-else-if="questions && questions.length > 0" class="max-w-2xl w-full p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
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
                  'bg-green-100 text-green-800': userAnswers[index] !== undefined && question.options[userAnswers[index]] === question.correct,
                  'bg-red-100 text-red-800': userAnswers[index] !== undefined && question.options[userAnswers[index]] !== question.correct,
                  'bg-gray-100 text-gray-800': userAnswers[index] === undefined
                }"
              >
                {{ 
                  userAnswers[index] === undefined ? 'No Answer' :
                  question.options[userAnswers[index]] === question.correct ? 'Correct' : 'Incorrect' 
                }}
              </div>
            </div>
          </div>

          <div v-if="question.imageUrl" class="mb-4">
            <img :src="question.imageUrl" :alt="question.text || 'Question image'" class="max-w-full h-auto rounded-lg border border-gray-200">
          </div>

          <div v-if="question.text" class="mb-4 p-4 bg-gray-50 rounded-lg">
            <p class="text-gray-800">{{ question.text }}</p>
          </div>

          <p class="text-gray-800 mb-4 font-medium">{{ question.question }}</p>

          <div class="space-y-2">
            <div 
              v-for="(option, optionIndex) in question.options" 
              :key="optionIndex"
              class="flex items-center p-3 rounded-lg border-2"
              :class="{
                'border-green-500 bg-green-50': optionIndex === question.correct,
                'border-red-500 bg-red-50': userAnswers[index] === optionIndex && optionIndex !== question.correct,
                'border-gray-200 bg-gray-50': optionIndex !== question.correct && userAnswers[index] !== optionIndex
              }"
            >
              <div class="flex items-center justify-between w-full">
                <span class="flex-1">{{ option }}</span>
                <div class="flex items-center gap-2 ml-4">
                  <span 
                    v-if="userAnswers[index] === optionIndex"
                    class="px-2 py-1 text-xs rounded-full"
                  >
                    Your Answer
                  </span>
                  <span 
                    v-if="optionIndex === question.correct"
                    class="px-2 py-1 text-xs bg-green-200 text-green-800 rounded-full"
                  >
                    Correct
                  </span>
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
const error = ref('')

try {
  const storedTestData = sessionStorage.getItem('testData')
  
  if (storedTestData) {
    questions.value = JSON.parse(storedTestData).questions
    userAnswers.value = JSON.parse(storedTestData).userAnswers
    
    sessionStorage.removeItem('testData')
  } else {
    navigateTo('/')
  }
} catch (err) {
  console.error('Error parsing test data from sessionStorage:', err)
  error.value = 'Failed to load test results'
}

const score = computed(() => {
  let correct = 0
  
  questions.value.forEach((question, index) => {
    const userAnswerIndex = userAnswers.value[index]
    if (userAnswerIndex !== undefined && question.options[userAnswerIndex] === question.correct) {
      correct++
    }
  })
  
  return correct
})


</script> 