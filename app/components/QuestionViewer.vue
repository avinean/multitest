<template>
  <div v-if="question" class="space-y-6">
    <img
      v-if="question.imageUrl"
      :key="question.imageUrl" 
      :src="question.imageUrl"
      :alt="`Question image`" 
      width="320"
      height="320"
      class="mx-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
    >
    
    <div v-if="question.text" class="prose prose-lg dark:prose-invert max-w-none prose-gray dark:prose-gray prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-primary-600 dark:prose-a:text-primary-400" v-html="question.text" />
    
    <div v-if="question.question" class="text-lg font-medium prose prose-lg dark:prose-invert max-w-none prose-gray dark:prose-gray text-gray-900 dark:text-white prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-primary-600 dark:prose-a:text-primary-400" v-html="question.question" />
    
    <div v-if="question.options && question.options.length > 0" class="space-y-6">
      <!-- Options Display -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="space-y-1">
          <div v-for="(option, index) in question.options" :key="index" class="flex items-start gap-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <span class="w-8 h-8 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-900 dark:text-white font-medium rounded-md text-sm flex-shrink-0">
              {{ String.fromCharCode(65 + index) }}
            </span>
            <span class="flex-1 text-gray-900 dark:text-white leading-relaxed">{{ option }}</span>
          </div>
        </div>
      </div>
      
      <!-- Answer Selection (Test Mode) -->
      <div v-if="mode === 'test'" class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div class="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-hand-raised" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          {{ $t('test.selectAnswer') }}
        </div>
        <div class="flex items-center gap-1 flex-wrap">
          <label 
            v-for="(option, index) in question.options" 
            :key="index" 
            class="flex flex-col gap-1 items-center cursor-pointer group"
            @click="userAnswer = index"
          >
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ String.fromCharCode(65 + index) }}
            </span>
            <input
              :value="index"
              type="radio"
              :name="radioGroupName"
              :checked="userAnswer === index"
              class="sr-only"
              @change="userAnswer = index"
            >
            <div
              class="w-8 h-8 border-2 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
              :class="{
                'bg-primary-500 dark:bg-primary-600 border-primary-500 dark:border-primary-600 text-white shadow-lg': userAnswer === index,
                'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md': userAnswer !== index
              }"
            >
              <span v-if="userAnswer === index" class="text-white font-bold text-lg text-gray-400 dark:text-gray-500">✓</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  question: Question
  mode: 'test' | 'preview'
  questionIndex?: number
}

const { questionIndex = 0 } = defineProps<Props>()

const userAnswer = defineModel<number>('userAnswer')

const radioGroupName = computed(() => `question-${questionIndex}-${Date.now()}`)
</script> 