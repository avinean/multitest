<template>
  <div class="space-y-4">
    <!-- Question Group Selection -->
    <UFormField label="Select Question Group" hint="Choose a question group from the database">
      <USelect
        v-model="questionGroupData.questionGroupId"
        :items="availableQuestionGroups"
        :disabled="disabled || _questionGroupsLoading"
        class="w-full"
        :placeholder="_questionGroupsLoading ? 'Loading question groups...' : 'Select a question group...'"
        @update:model-value="onQuestionGroupSelect"
      />
    </UFormField>

    <!-- Loading State -->
    <div v-if="_questionGroupsLoading" class="text-center py-4">
      <div class="flex items-center justify-center gap-2 text-gray-500">
        <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
        <span class="text-sm">Loading question groups...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="_questionGroupsError" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-red-700">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
        <span class="text-sm">Error loading question groups: {{ _questionGroupsError }}</span>
      </div>
    </div>

    <!-- Question Group Details (if question group is selected) -->
    <div v-if="selectedQuestionGroup" class="bg-white p-4 rounded-lg border border-gray-200">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Question Group Details</h4>
      
              <div class="space-y-3">
          <div>
            <label class="text-xs font-medium text-gray-600">Question Group Title</label>
            <p class="text-sm text-gray-900">{{ selectedQuestionGroup.title }}</p>
          </div>
          
          <div v-if="selectedQuestionGroup.description">
            <label class="text-xs font-medium text-gray-600">Description</label>
            <p class="text-sm text-gray-700">{{ selectedQuestionGroup.description }}</p>
          </div>
        </div>
      </div>

      <!-- Custom Title and Description -->
      <div class="space-y-4">
        <UFormField label="Custom Title (Optional)" hint="Override the question group's default title">
          <UInput 
            v-model="questionGroupData.title"
            :placeholder="selectedQuestionGroup?.title || 'Enter custom title...'"
            :disabled
            class="w-full"
          />
        </UFormField>

        <UFormField label="Custom Description (Optional)" hint="Override the question group's default description">
          <UTextarea 
            v-model="questionGroupData.description"
            :placeholder="selectedQuestionGroup?.description || 'Enter custom description...'"
            :disabled
            :rows="3"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Empty State -->
      <div v-if="!questionGroupData.questionGroupId && !_questionGroupsLoading && !_questionGroupsError" class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
        <div class="text-gray-400 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="text-sm text-gray-500">No question group selected</p>
        <p class="text-xs text-gray-400 mt-1">Choose a question group from the dropdown above</p>
      </div>
  </div>
</template>

<script setup lang="ts">
import { collection } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

interface QuestionGroupOption {
  value: string
  label: string
  title?: string
  description?: string
}

interface Props {
  modelValue: {
    questionGroupId: string
    title?: string
    description?: string
  }
  disabled?: boolean
}

const { disabled } = defineProps<Props>()

// Use defineModel for two-way binding
const questionGroupData = defineModel<{
  questionGroupId: string
  title?: string
  description?: string
}>('modelValue', { required: true })

// Initialize Firestore
const db = useFirestore()

// Fetch question groups from the database
const { data: questionGroups, pending: _questionGroupsLoading, error: _questionGroupsError } = useCollection(
  collection(db, 'question-groups')
)

// Transform question groups data for the select component
const availableQuestionGroups = computed<QuestionGroupOption[]>(() => {
  if (!questionGroups.value) return []
  
  return questionGroups.value
    .filter(qg => !qg.archived) // Exclude archived question groups
    .map(qg => ({
      value: qg.id,
      label: qg.title || qg.name || 'Untitled Question Group',
      title: qg.title || qg.name || 'Untitled Question Group',
      description: qg.description || ''
    }))
})

// Computed property to get the selected question group details
const selectedQuestionGroup = computed(() => {
  return availableQuestionGroups.value.find(qg => qg.value === questionGroupData.value.questionGroupId)
})

// Handle question group selection
const onQuestionGroupSelect = (questionGroupId: string) => {
  const questionGroup = availableQuestionGroups.value.find(qg => qg.value === questionGroupId)
  if (questionGroup) {
    // Auto-fill title and description if not already set
    if (!questionGroupData.value.title) {
      questionGroupData.value.title = questionGroup.title
    }
    if (!questionGroupData.value.description) {
      questionGroupData.value.description = questionGroup.description
    }
  }
}
</script> 