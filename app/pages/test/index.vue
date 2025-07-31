<template>
  <div class="flex flex-col"> 
    <div
      v-if="!pending && !error && questions && questions?.length > 0" 
      class="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg dark:shadow-gray-900/25 p-3 min-w-[160px]"
    >
      <div class="text-center">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{{ $t('test.timeRemainingShort') }}</div>
        <div class="text-lg font-bold" :class="timeRemainingClass">
          {{ formatTime(timeRemaining) }}
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {{ Math.round((timeRemaining / TOTAL_TIME) * 100) }}{{ $t('test.percentLeft') }}
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <ModalLogin v-model:open="showLoginModal" :redirect="localePath('/test/result')" />

    <div v-if="pending" class="flex-1 flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"/>
        <p class="text-lg text-gray-900 dark:text-white">{{ $t('test.loading') }}</p>
      </div>
    </div>

    <div v-else-if="error" class="flex-1 flex justify-center items-center min-h-screen">
      <div class="max-w-md w-full p-8 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg shadow-sm text-center">
        <div class="text-red-500 dark:text-red-400 text-6xl mb-4">⚠️</div>
        <h2 class="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">{{ $t('test.error') }}</h2>
        <p class="text-red-600 dark:text-red-300 mb-6">{{ error }}</p>
        <UButton 
          color="error" 
          @click="$router.go(0)"
          class="bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 text-white"
        >
          {{ $t('test.reloadPage') }}
        </UButton>
      </div>
    </div>

    <div v-else-if="questions && questions?.length > 0" class="flex-1 flex flex-col">
      <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
        <div class="max-w-6xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('test.navigation.title') }}</h3>
            <div class="text-sm text-gray-600 dark:text-gray-300">
              {{ answeredCount }} {{ $t('test.of') }} {{ questions.length }} {{ $t('test.navigation.answered') }}
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="(question, index) in questions"
              :key="index"
              class="w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-105"
              :class="{
                'border-primary-500 bg-primary-100 dark:bg-primary-900/50 text-primary-900 dark:text-primary-100': index === currentQuestionIndex,
                'border-green-500 bg-green-100 dark:bg-green-900/50 text-green-900 dark:text-green-100': answers[`${question.groupId}-${index}`] !== undefined && index !== currentQuestionIndex,
                'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300': answers[`${question.groupId}-${index}`] === undefined && index !== currentQuestionIndex
              }"
              @click="goToQuestion(index)"  
            >
              {{ index + 1 }}
            </button>
          </div>
          
          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-primary-500 bg-primary-100 dark:bg-primary-900/50 rounded"/>
              <span class="text-gray-600 dark:text-gray-300">{{ $t('test.navigation.current') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-green-500 bg-green-100 dark:bg-green-900/50 rounded"/>
              <span class="text-gray-600 dark:text-gray-300">{{ $t('test.navigation.answered') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded"/>
              <span class="text-gray-600 dark:text-gray-300">{{ $t('test.navigation.unanswered') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div v-if="currentQuestion" class="max-w-4xl mx-auto">
          <QuestionViewer 
            v-model:user-answer="answers[`${currentQuestion.groupId}-${currentQuestionIndex}`]"
            :question="currentQuestion"
            mode="test"
            :question-index="currentQuestionIndex"
          />
        </div>
      </div>

      <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
        <div class="max-w-4xl mx-auto flex justify-between">
          <UButton 
            :disabled="currentQuestionIndex === 0" 
            color="neutral"
            variant="outline"
            @click="previousQuestion"
            class="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ $t('test.previousButton') }}
          </UButton>
          
          <UButton 
            color="primary"
            @click="nextQuestion"
            class="bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white"
          >
            {{ isLastQuestion ? $t('test.finishTest') : $t('test.nextButton') }}
          </UButton>
        </div>
      </div>
    </div>

    <div v-else class="flex-1 flex justify-center items-center min-h-screen">
      <div class="max-w-md w-full p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-center">
        <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{{ $t('test.noTestAvailable.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('test.noTestAvailable.message') }}</p>
        <UButton 
          @click="navigateTo($localePath('/'))"
          class="bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white"
        >
          {{ $t('test.noTestAvailable.action') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { query, where, collection, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

definePageMeta({
  ssr: false
})

// SEO Meta
useHead({
  title: computed(() => $t('test.meta.title')),
  meta: [
    { name: 'description', content: computed(() => $t('test.meta.description')) },
    { name: 'keywords', content: 'english test, proficiency test, grammar test, vocabulary test, online assessment, free english test' },
    { property: 'og:title', content: computed(() => $t('test.meta.title')) },
    { property: 'og:description', content: computed(() => $t('test.meta.description')) },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: computed(() => $t('test.meta.title')) },
    { name: 'twitter:description', content: computed(() => $t('test.meta.description')) }
  ]
})

const { user } = await useAuth()
const db = useFirestore()
const localePath = useLocalePath()

const TOTAL_TIME = 60 * 60 * 1000 // 60 minutes
const timeRemaining = ref(TOTAL_TIME)
const testStartTime = ref<number | null>(null)
const timerInterval = ref<NodeJS.Timeout | null>(null)
const showLoginModal = ref(false)
const currentQuestionIndex = ref(0)
const answers = ref<Record<`${string}-${number}`, number>>({})

const { data: questions, pending, error } = useAsyncData<Question[]>('test', async () => (await Promise.all(questionGroupTypes.map(({ value }) =>
  getDocs(
    query(
      collection(db, 'question-groups'),
      where('type', '==', value),
      where('published', '==', true)
    )
  ).then(({ docs }) => {
    const group = docs[Math.floor(Math.random() * docs.length)]
    return group?.data().questions.map((question: Question) => ({
      ...question,
      groupId: group.id,
    }))
  })))).flat())

const currentQuestion = computed(() => questions.value?.[currentQuestionIndex.value])
const isLastQuestion = computed(() => questions.value && currentQuestionIndex.value === questions.value?.length - 1)
const answeredCount = computed(() => questions.value?.filter((question) => answers.value[`${question.groupId}-${question.order}`] !== undefined).length)
const timeRemainingClass = computed(() => {
  const percentage = (timeRemaining.value / TOTAL_TIME) * 100
  if (percentage <= 10) return 'text-red-600 dark:text-red-400'
  if (percentage <= 25) return 'text-orange-500 dark:text-orange-400'
  return 'text-green-600 dark:text-green-400'
})

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

const goToQuestion = (index: number) => {
  if (questions.value && index >= 0 && index < questions.value?.length) {
    currentQuestionIndex.value = index
  }
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const finishTest = () => {
  if (questions.value?.length) {
    sessionStorage.setItem('testData', JSON.stringify({
      questions: questions.value,
      answers: answers.value,
      timeTaken: TOTAL_TIME - timeRemaining.value
    }))
  }
  if (user.value) {
    stopTimer()
    navigateTo(localePath('/test/result'))
  } else {
    showLoginModal.value = true
  }
}

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

watchOnce(questions, () => {
  testStartTime.value = Date.now()

  timerInterval.value = setInterval(() => {
    const elapsed = Date.now() - testStartTime.value!
    timeRemaining.value = Math.max(0, TOTAL_TIME - elapsed)
    
    if (timeRemaining.value <= 0) {
      finishTest()
    }
  }, 1000)
})
</script> 