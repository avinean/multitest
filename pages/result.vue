<template>
  <div class="flex-1 flex flex-col py-4 justify-center items-center min-h-screen">
    <div v-if="loading" class="text-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"/>
      <p class="text-lg">Loading results...</p>
    </div>

    <div v-else-if="error" class="max-w-md w-full p-8 bg-white border border-red-200 rounded-lg shadow-sm text-center">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-red-800 mb-4">Error Loading Results</h2>
      <p class="text-red-600 mb-6">{{ error }}</p>
      <UButton color="red" @click="$router.go(0)">Reload Page</UButton>
    </div>

    <div v-else-if="questions.length > 0" class="max-w-2xl w-full p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center">
      <h1 class="text-3xl font-bold mb-8">🎉 Test Complete!</h1>
      
      <div class="my-8">
        <div class="inline-flex items-center justify-center w-32 h-32 border-8 border-primary-500 rounded-full mb-4">
          <span class="text-3xl font-bold">{{ score }}</span>
          <span class="text-xl">/ {{ questions.length }}</span>
        </div>
        <p class="text-2xl font-semibold">{{ Math.round((score / questions.length) * 100) }}%</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 class="text-2xl font-bold mb-6">Question Review</h2>
      
      <div class="space-y-8">
        <div v-for="(question, index) in questions" :key="index" class="border-b border-gray-200 pb-6 last:border-b-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Question {{ index + 1 }}</h3>
            <div class="flex items-center gap-2">
              <div 
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="userAnswers[index] === question.correctAnswerIndex ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ userAnswers[index] === question.correctAnswerIndex ? 'Correct' : 'Incorrect' }}
              </div>
            </div>
          </div>

          <div v-if="question.title || question.subtitle" class="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 v-if="question.title" class="font-semibold mb-2">{{ question.title }}</h4>
            <h5 v-if="question.subtitle" class="text-sm text-gray-600 mb-2">{{ question.subtitle }}</h5>
          </div>

          <p class="text-gray-800 mb-4 font-medium">{{ question.text }}</p>

          <div class="space-y-2">
            <div 
              v-for="(option, optionIndex) in question.options" 
              :key="optionIndex"
              class="flex items-center p-3 rounded-lg border-2"
              :class="{
                'border-green-500 bg-green-50': optionIndex === question.correctAnswerIndex,
                'border-red-500 bg-red-50': optionIndex === userAnswers[index] && optionIndex !== question.correctAnswerIndex,
                'border-gray-200 bg-gray-50': optionIndex !== question.correctAnswerIndex && optionIndex !== userAnswers[index]
              }"
            >
              <div class="flex items-center justify-between w-full">
                <span class="flex-1">{{ option }}</span>
                <div class="flex items-center gap-2 ml-4">
                  <span 
                    v-if="optionIndex === userAnswers[index]"
                    class="px-2 py-1 text-xs rounded-full"
                    :class="optionIndex === question.correctAnswerIndex ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'"
                  >
                    Your Answer
                  </span>
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

          <div v-if="userAnswers[index] === undefined" class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span class="text-yellow-800 text-sm font-medium">No answer selected</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Test Results - English Proficiency Test'
})

const route = useRoute()
const userAnswers = ref({})

const { loading, error, questions } = useTest()

onMounted(() => {
  const savedResults = localStorage.getItem('testResults')
  if (savedResults) {
    const resultsData = JSON.parse(savedResults)
    userAnswers.value = resultsData.userAnswers
  } else {
    if (route.query.results) {
      const resultsData = JSON.parse(decodeURIComponent(route.query.results))
      userAnswers.value = resultsData.userAnswers
    } else {
      navigateTo('/test')
    }
  }
})

const score = computed(() => {
  let correct = 0
  questions.value.forEach((question, index) => {
    if (userAnswers.value[index] === question.correctAnswerIndex) {
      correct++
    }
  })
  return correct
})
</script> 