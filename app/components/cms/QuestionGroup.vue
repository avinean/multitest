<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <div class="flex items-center justify-center gap-2 text-gray-500">
        <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
        <span>Loading question group...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center gap-2 text-red-700">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
        <span>Error loading question group: {{ error }}</span>
      </div>
    </div>

    <!-- Question Group Content -->
    <div v-else-if="questionGroup" class="space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ section.title || questionGroup.name || 'Question Group' }}
        </h2>
        <p v-if="section.description" class="text-gray-600">
          {{ section.description }}
        </p>
      </div>

      <!-- Test Mode -->
      <div v-if="!showResults" class="space-y-6">
        <!-- Progress -->
        <div class="bg-gray-100 rounded-lg p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Progress</span>
            <span class="text-sm text-gray-500">{{ currentQuestionIndex + 1 }} of {{ questionGroup.questions.length }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-primary-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((currentQuestionIndex + 1) / questionGroup.questions.length) * 100}%` }"
            />
          </div>
        </div>

        <!-- Current Question -->
        <div v-if="currentQuestion" class="bg-white rounded-lg shadow-sm p-6">
          <UseQuestionViewer
            v-model:user-answer="userAnswers[currentQuestionIndex]"
            :question="currentQuestion"
            mode="test"
            :question-index="currentQuestionIndex"
          />
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
          <UButton
            v-if="currentQuestionIndex > 0"
            variant="outline"
            @click="currentQuestionIndex--"
          >
            Previous
          </UButton>
          <div v-else/>

          <UButton
            v-if="currentQuestionIndex < questionGroup.questions.length - 1"
            :disabled="userAnswers[currentQuestionIndex] === undefined"
            @click="currentQuestionIndex++"
          >
            Next
          </UButton>
          <UButton
            v-else
            :disabled="userAnswers[currentQuestionIndex] === undefined"
            color="success"
            @click="showResults = true"
          >
            Finish Test
          </UButton>
        </div>
      </div>

      <!-- Results Mode -->
      <div v-else-if="showResults" class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Test Results</h3>
          
          <!-- Score Summary -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 mb-2">
                {{ correctAnswers || 0 }}/{{ questionGroup.questions.length }}
              </div>
              <div class="text-lg text-gray-600 mb-2">
                {{ Math.round(((correctAnswers || 0) / questionGroup.questions.length) * 100) }}% Correct
              </div>
              <div class="text-sm text-gray-500">
                {{ (correctAnswers || 0) === questionGroup.questions.length ? 'Perfect score!' : 
                   (correctAnswers || 0) >= questionGroup.questions.length * 0.8 ? 'Great job!' :
                   (correctAnswers || 0) >= questionGroup.questions.length * 0.6 ? 'Good effort!' : 'Keep practicing!' }}
              </div>
            </div>
          </div>

          <!-- Question Review -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-900">Question Review</h4>
            <div 
              v-for="(question, index) in questionGroup.questions" 
              :key="index"
              class="border rounded-lg p-4"
              :class="{
                'border-green-200 bg-green-50': userAnswers[index] === question.correct,
                'border-red-200 bg-red-50': userAnswers[index] !== question.correct
              }"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0">
                  <div 
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                    :class="{
                      'bg-green-500 text-white': userAnswers[index] === question.correct,
                      'bg-red-500 text-white': userAnswers[index] !== question.correct
                    }"
                  >
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="flex-1 space-y-2">
                  <div v-if="question.text" class="prose prose-sm max-w-none" v-html="question.text" />
                  <div v-if="question.question" class="font-medium" v-html="question.question" />
                  
                  <div v-if="question.options" class="space-y-1">
                    <div 
                      v-for="(option, optionIndex) in question.options" 
                      :key="optionIndex"
                      class="flex items-center gap-2 text-sm"
                      :class="{
                        'text-green-700 font-medium': optionIndex === question.correct,
                        'text-red-700 font-medium': optionIndex === userAnswers[index] && optionIndex !== question.correct
                      }"
                    >
                      <span
class="w-6 h-6 rounded flex items-center justify-center text-xs"
                        :class="{
                          'bg-green-500 text-white': optionIndex === question.correct,
                          'bg-red-500 text-white': optionIndex === userAnswers[index] && optionIndex !== question.correct,
                          'bg-gray-200 text-gray-600': optionIndex !== question.correct && optionIndex !== userAnswers[index]
                        }"
                      >
                        {{ String.fromCharCode(65 + optionIndex) }}
                      </span>
                      <span>{{ option }}</span>
                      <span v-if="optionIndex === question.correct" class="text-green-600">✓ Correct</span>
                      <span v-if="optionIndex === userAnswers[index] && optionIndex !== question.correct" class="text-red-600">✗ Your Answer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-center gap-4 mt-6">
            <UButton variant="outline" @click="restartTest">
              Retake Test
            </UButton>
            <UButton @click="showResults = false">
              Back to Test
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <div class="text-gray-400 mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-gray-500">Question group not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'

const { section } = defineProps<{
  section: CMSQuestionGroup
}>()

// Initialize Firestore
const db = useFirestore()

// Fetch question group from database
const { data: questionGroup, pending, error } = useDocument<QuestionGroup>(
  doc(db, 'question-groups', section.questionGroupId)
)

// Test state
const currentQuestionIndex = ref(0)
const userAnswers = ref<(number | undefined)[]>([])
const showResults = ref(false)

// Initialize user answers array when question group loads
watch(questionGroup, (newQuestionGroup) => {
  if (newQuestionGroup) {
    userAnswers.value = new Array(newQuestionGroup.questions.length).fill(undefined)
  }
}, { immediate: true })

// Computed properties
const currentQuestion = computed(() => {
  if (!questionGroup.value) return null
  return questionGroup.value.questions[currentQuestionIndex.value]
})

const correctAnswers = computed(() => {
  if (!questionGroup.value) return 0
  return userAnswers.value.reduce((count = 0, userAnswer, index) => {
    const question = questionGroup.value!.questions[index]
    return count + (userAnswer === question.correct ? 1 : 0)
  }, 0)
})

// Methods
const restartTest = () => {
  currentQuestionIndex.value = 0
  userAnswers.value = new Array(questionGroup.value?.questions.length || 0).fill(undefined)
  showResults.value = false
}
</script>