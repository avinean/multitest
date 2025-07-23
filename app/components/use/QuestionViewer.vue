<template>
  <div v-if="question" class="space-y-6">
    <img
      v-if="question.imageUrl"
      :key="question.imageUrl" 
      :src="question.imageUrl"
      :alt="`Question image`" 
      width="320"
      height="320"
      class="mx-auto rounded-lg shadow-lg"
    >
    <div v-if="question.text" class="prose prose-lg max-w-none" v-html="question.text" />
    <div v-if="question.question" class="text-lg font-medium prose prose-lg max-w-none" v-html="question.question" />
    <div v-if="question.options && question.options.length > 0" class="space-y-3">
      <div class="space-y-1">
        <div v-for="(option, index) in question.options" :key="index" class="flex items-center gap-1 flex-1">
          <span class="w-8 h-8 bg-gray-200 flex items-center justify-center">
            {{ String.fromCharCode(65 + index) }}
          </span>
          <span class="flex-1">{{ option }}</span>
        </div>
      </div>
      <div v-if="mode === 'test'">
        <div class="font-semibold">Select the correct answer</div>
        <div class="flex items-center gap-1">
          <label v-for="(option, index) in question.options" :key="index" class="flex flex-col gap-1 items-center">
            <span>
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
              class="w-8 h-8 border-2 border-gray-400 rounded flex items-center justify-center cursor-pointer"
              :class="{
                'bg-primary-500 border-primary-500 text-white': userAnswer === index,
                'bg-white': userAnswer !== index
            }">
                <span v-if="userAnswer === index" class="text-white font-bold">✓</span>
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

const props = withDefaults(defineProps<Props>(), {
  questionIndex: 0
})

const userAnswer = defineModel<number>('userAnswer')

const radioGroupName = computed(() => `question-${props.questionIndex}-${Date.now()}`)
</script> 