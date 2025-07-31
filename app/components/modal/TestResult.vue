<template>
  <UModal v-model:open="isOpen" fullscreen>
    <template #body>
      <div class="space-y-6">
        <!-- Test Summary -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ result?.score || 0 }}/{{ result?.totalQuestions || 0 }}</div>
            <div class="text-sm text-gray-600">{{ $t('profile.score') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ result?.percentage || 0 }}%</div>
            <div class="text-sm text-gray-600">{{ $t('profile.percentage') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ formatTime(result?.timeTaken ?? 0) }}</div>
            <div class="text-sm text-gray-600">{{ $t('profile.timeTaken') }}</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              <NuxtTime v-if="result?.createdAt" :datetime="result.createdAt" month="short" day="numeric" year="numeric" />
              <span v-else>-</span>
            </div>
            <div class="text-sm text-gray-600">{{ $t('profile.testDate') }}</div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"/>
            <p class="text-lg text-gray-600">{{ $t('common.loading') }}</p>
          </div>
        </div>

        <!-- Questions and Answers -->
        <div v-else-if="questions.length > 0">
          <h4 class="text-lg font-semibold mb-6">{{ $t('profile.questionsAndAnswers') }}</h4>
          <div class="space-y-8">
            <div 
              v-for="(question, index) in questions" 
              :key="`${question.groupId}-${question.order}`"
              class="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold">{{ $t('test.question') }} {{ index + 1 }}</h3>
                <div class="flex items-center gap-2">
                  <div 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="{
                      'bg-green-100 text-green-800': isAnswerCorrect(question),
                      'bg-red-100 text-red-800': !isAnswerCorrect(question) && hasAnswer(question),
                      'bg-gray-100 text-gray-800': !hasAnswer(question)
                    }"
                  >
                    {{ 
                      !hasAnswer(question) ? $t('result.noAnswer') :
                      isAnswerCorrect(question) ? $t('result.correct') : $t('result.incorrect') 
                    }}
                  </div>
                </div>
              </div>

              <div v-if="question.imageUrl" class="mb-4">
                <img :src="question.imageUrl" :alt="question.text || 'Question image'" class="max-w-80 mx-auto rounded-lg shadow-lg">
              </div>

              <div v-if="question.text" class="mb-4 p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none" v-html="question.text" />

              <div class="mb-4 font-medium prose prose-sm max-w-none" v-html="question.question" />

              <div v-if="question.options && question.options.length > 0" class="space-y-1 mb-4">
                <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex items-center gap-1 flex-1">
                  <span class="w-8 h-8 bg-gray-200 flex items-center justify-center">
                    {{ String.fromCharCode(65 + optionIndex) }}
                  </span>
                  <span class="flex-1">{{ option }}</span>
                </div>
              </div>
              
              <div>
                <div class="font-semibold mb-2">{{ $t('result.answerReview') }}</div>
                <div class="flex items-center gap-2">
                  <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="flex flex-col gap-1 items-center">
                    <span class="text-sm">
                      {{ String.fromCharCode(65 + optionIndex) }}
                    </span>
                    <div
                      class="w-8 h-8 border-2 rounded flex items-center justify-center"
                      :class="{
                        'bg-green-500 border-green-500 text-white': optionIndex === question.correct,
                        'bg-red-500 border-red-500 text-white': getSelectedOption(question) === optionIndex && optionIndex !== question.correct,
                        'bg-gray-100 border-gray-400': optionIndex !== question.correct && getSelectedOption(question) !== optionIndex
                      }"
                    >
                      <span v-if="optionIndex === question.correct" class="text-white font-bold">✓</span>
                      <span v-else-if="getSelectedOption(question) === optionIndex && optionIndex !== question.correct" class="text-white font-bold">✗</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="!hasAnswer(question)" class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span class="text-yellow-800 text-sm font-medium">{{ $t('result.noAnswerSelected') }}</span>
              </div>

              <!-- Explanation -->
              <div v-if="question.explanation" class="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div class="flex items-start gap-2">
                  <div class="text-amber-600 mt-0.5">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-amber-800 mb-1">{{ $t('result.explanation') || 'Explanation' }}</h4>
                    <div class="text-sm text-amber-700 prose prose-sm max-w-none" v-html="question.explanation"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Questions Available -->
        <div v-else class="text-center py-8 text-gray-500">
          <div class="text-4xl mb-2">📝</div>
          <p>{{ $t('profile.noQuestionsAvailable') }}</p>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { collection, doc, getDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

const props = defineProps<{
  result: TestResult | null
}>()
const isOpen = defineModel<boolean>()
const { t } = useI18n()
const db = useFirestore()

// State for fetched questions
const questions = ref<Question[]>([])
const loading = ref(false)

// Fetch questions when modal opens
watch(isOpen, async (open) => {
  if (open && props.result) {
    await fetchQuestions()
  }
})

const fetchQuestions = async () => {
  if (!props.result) return
  
  loading.value = true
  try {
    const questionGroups: Question[] = []
    
    // Extract unique group IDs from answers
    const groupIds = [...new Set(
      Object.keys(props.result.answers).map(key => key.split('-')[0])
    )]
    
    // Fetch each question group
    for (const groupId of groupIds) {
      if (groupId) {
        const groupDoc = await getDoc(doc(db, 'question-groups', groupId))
        if (groupDoc.exists()) {
          const groupData = groupDoc.data() as QuestionGroup
          const groupQuestions = groupData.questions.map((q, index) => ({
            ...q,
            groupId,
            order: index
          })) as Question[]
          questionGroups.push(...groupQuestions)
        }
      }
    }
    
    questions.value = questionGroups.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error fetching questions:', error)
  } finally {
    loading.value = false
  }
}

const formatTime = (milliseconds: number | undefined) => {
  if (!milliseconds) return '-'
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

const getAnswerText = (question: Question) => {
  const answerKey = `${question.groupId}-${question.order}` as const
  const selectedOption = props.result?.answers[answerKey]
  
  if (selectedOption === undefined) return t('profile.noAnswer')
  
  if (question.options && question.options.length > 0) {
    return question.options[selectedOption] || t('profile.noAnswer')
  }
  
  return t('profile.noAnswer')
}

const getCorrectAnswerText = (question: Question) => {
  if (question.options && question.options.length > 0) {
    return question.options[question.correct] || t('profile.noAnswer')
  }
  
  return t('profile.noAnswer')
}

const isAnswerCorrect = (question: Question) => {
  const answerKey = `${question.groupId}-${question.order}` as const
  const selectedOption = props.result?.answers[answerKey]
  
  if (selectedOption === undefined) return false
  
  return selectedOption === question.correct
}

const hasAnswer = (question: Question) => {
  const answerKey = `${question.groupId}-${question.order}` as const
  return props.result?.answers[answerKey] !== undefined
}

const getSelectedOption = (question: Question) => {
  const answerKey = `${question.groupId}-${question.order}` as const
  return props.result?.answers[answerKey]
}
</script> 