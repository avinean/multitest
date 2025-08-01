<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4">
        <UButton 
          :to="localePath('/admin/question-groups')" 
          color="gray" 
          variant="outline" 
          icon="i-heroicons-arrow-left"
        >
          Back to Question Groups
        </UButton>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isNewGroup ? 'Create New Question Group' : `Edit: ${groupData?.name || 'Question Group'}` }}
          </h2>
          <p class="text-gray-600 mt-1">
            {{ isNewGroup ? 'Add a new question group to the system' : 'Modify question group settings and content' }}
          </p>
        </div>
        <UButton 
          v-if="!isNewGroup && groupData?.questions?.length > 0"
          color="primary" 
          variant="outline" 
          icon="i-heroicons-eye"
          @click="openPreview"
        >
          Preview Group
        </UButton>
      </div>
    </div>

    <!-- Loading State (for editing existing group) -->
    <div v-if="!isNewGroup && groupLoading" class="max-w-2xl">
      <div class="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"/>
          <span class="text-gray-600">Loading question group...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!isNewGroup && groupError" class="max-w-2xl">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex">
          <div class="text-red-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading question group</h3>
            <p class="mt-1 text-sm text-red-700">{{ groupError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form (shown when ready) -->
    <div v-else-if="isNewGroup || (!groupLoading && groupData)" class="max-w-2xl mx-auto">
      <div v-if="saveError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex">
          <div class="text-red-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error {{ isNewGroup ? 'creating' : 'updating' }} question group
            </h3>
            <p class="mt-1 text-sm text-red-700">{{ saveError }}</p>
          </div>
        </div>
      </div>

      <UForm 
        class="space-y-6" 
        :state="groupForm" 
        :validate-on="[]"
        @submit="saveGroup"
      >
        <UFormField label="Name *" hint="Give this question group a descriptive name.">
          <UInput 
            v-model="groupForm.name"
            placeholder="Enter question group name..."
            :disabled="saving"
            required
          />
        </UFormField>

        <UFormField label="Type *" hint="Select the type of question group you want to create.">
          <USelect 
            v-model="groupForm.type"
            :items="questionGroupTypes"
            :disabled="saving"
            placeholder="Select question group type"
            required
          />
        </UFormField>

        <UFormField v-if="groupData" label="Publication Status" hint="Control whether this question group is published and available for use.">
          <USwitch 
            v-model="groupForm.published"
            :disabled="saving || groupForm.archived"
          />
          <span class="text-sm" :class="groupForm.published ? 'text-green-600 font-medium' : 'text-gray-500'">
            {{ groupForm.archived ? $t('admin.questionGroup.archivedStatus') : (groupForm.published ? $t('admin.questionGroup.publishedStatus') : $t('admin.questionGroup.draftStatus')) }}
          </span>
        </UFormField>

        <UFormField v-if="groupData" label="Archived Status" hint="Control whether this question group is archived and not available for use.">
          <USwitch 
            v-model="groupForm.archived"
            :disabled="saving"
          />
          <span class="text-sm" :class="groupForm.archived ? 'text-red-600 font-medium' : 'text-gray-500'">
            {{ groupForm.archived ? $t('admin.questionGroup.archivedStatus') : $t('admin.questionGroup.activeStatus') }}
          </span>
        </UFormField>

        <!-- Questions list for existing groups -->
        <template v-if="!isNewGroup">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-sm font-medium text-gray-700">Sub-Questions</h4>
            <UButton size="sm" @click="addQuestion">Add Sub-Question</UButton>
          </div>
      
          <!-- Questions List -->
          <div v-if="groupData?.questions?.length > 0" class="space-y-3">
            <div 
              v-for="(question, index) in groupData.questions" 
              :key="index"
              class="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Q{{ index + 1 }}
                    </span>
                  </div>
                  <p v-if="question.imageUrl" class="text-sm text-gray-700 mb-2">
                    <strong>Image:</strong> {{ question.imageUrl.length > 50 ? question.imageUrl.substring(0, 50) + '...' : question.imageUrl }}
                  </p>
                  <p v-if="question.text" class="text-sm text-gray-700 mb-2">
                    <strong>Text:</strong> {{ question.text.length > 100 ? question.text.substring(0, 100) + '...' : question.text }}
                  </p>
                  <p v-if="question.question" class="text-sm text-gray-700 mb-2">
                    <strong>Question:</strong> {{ question.question.length > 100 ? question.question.substring(0, 100) + '...' : question.question }}
                  </p>
                  <div class="text-xs text-gray-500">
                    {{ question.options?.length || 0 }} options
                    <span v-if="question.correct !== undefined && question.options?.[question.correct]">
                      • Correct: {{ question.options[question.correct] }}
                    </span>
                  </div>
                </div>
                <div class="flex gap-2 ml-4">
                  <UButton size="xs" variant="outline" @click="editQuestion(index)">
                    Edit
                  </UButton>
                  <UButton size="xs" color="neutral" variant="outline" @click="duplicateQuestion(index)">
                    Duplicate
                  </UButton>
                  <UButton size="xs" color="error" variant="outline" @click="deleteQuestion(index)">
                    Delete
                  </UButton>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No questions state -->
          <div v-else class="text-center py-6">
            <div class="text-gray-400 mb-2">
              <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-sm text-gray-500 mb-3">No sub-questions added yet</p>
            <UButton size="sm" @click="addQuestion">Add First Sub-Question</UButton>
          </div>
        </template>

        <!-- Info box for new groups -->
        <div v-if="isNewGroup" class="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div class="flex">
            <div class="text-slate-400">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-slate-800">Getting Started</h3>
              <p class="mt-1 text-sm text-slate-700">
                Create and save this question group first, then you'll be able to add individual sub-questions to organize your content.
              </p>
            </div>
          </div>
        </div>

          <!-- Action Buttons -->
        <div class="flex justify-end gap-3 py-6 sticky bottom-0 bg-white">
          <UButton 
            type="button" 
            color="info" 
            variant="outline"
            :disabled="saving"
            @click="navigateTo(localePath('/admin/question-groups'))"
          >
            Cancel
          </UButton>
          <UButton 
            type="submit"
            :loading="saving"
            :disabled="!isFormValid()"
          >
            {{ isNewGroup ? 'Create Question Group' : 'Update Question Group' }}
          </UButton>
        </div>
      </UForm>
    </div>

    <!-- Sub-Question Modal -->
    <UModal 
      v-model:open="showSubQuestionModal" 
      :title="editingSubQuestionIndex !== null ? 'Edit Sub-Question' : 'Add New Sub-Question'"
      :ui="{ content: 'w-full max-w-2xl' }"
    >
      <template #body>
        <!-- Sub-question save error -->
        <div v-if="subQuestionSaveError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex">
            <div class="text-red-400">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error saving sub-question</h3>
              <p class="mt-1 text-sm text-red-700">{{ subQuestionSaveError }}</p>
            </div>
          </div>
        </div>

        <!-- Sub-question Form -->
        <UForm 
          class="space-y-6" 
          :state="subQuestionForm" 
          :validate-on="[]"
          @submit="saveSubQuestion"
        >
          <!-- Image field -->
          <UFormField 
            label="Image" 
            hint="Upload an image for this sub-question."
          >
            <ImageUpload
              v-model="subQuestionForm.imageUrl"
              storage-path="question-images"
              :disabled="savingSubQuestion"
              auto-upload
            />
          </UFormField>

          <!-- Text field -->
          <UFormField 
            label="Text Content" 
            hint="Text content for this sub-question. You can use rich formatting like bold, italic, lists, etc."
          >
            <AdminRichText 
              v-model="subQuestionForm.text"
              :disabled="savingSubQuestion"
              style="min-height: 120px;"
            />
          </UFormField>

          <!-- Question field -->
          <UFormField 
            label="Question" 
            hint="The question text for this sub-question. You can use rich formatting like bold, italic, lists, etc."
          >
            <AdminRichText 
              v-model="subQuestionForm.question"
              :disabled="savingSubQuestion"
              style="min-height: 100px;"
            />
          </UFormField>

          <!-- Answer Options (always required for all sub-questions) -->
          <UFormField 
            label="Answer Options *" 
            :hint="`Add answer options and select the correct one. Maximum ${getMaxOptionsForGroupType()} options allowed for ${groupForm.type} type.`"
          >
            <!-- Options Mode Toggle -->
            <div class="mb-4 flex gap-2">
              <UButton 
                type="button" 
                variant="outline" 
                size="sm"
                :disabled="savingSubQuestion"
                @click="toggleBulkOptions"
              >
                {{ showBulkOptions ? 'Individual Options' : 'Bulk Add Options' }}
              </UButton>
            </div>

            <!-- Bulk Options Mode -->
            <div v-if="showBulkOptions" class="space-y-3">
              <div>
                <UTextarea 
                  v-model="bulkOptionsText"
                  placeholder="Enter one option per line&#10;Option 1&#10;Option 2&#10;Option 3&#10;Option 4"
                  :disabled="savingSubQuestion"
                  :rows="10"
                  class="w-full text-sm"
                />
                <div class="text-xs text-gray-500 mt-1 space-y-1">
                  <p>
                    Enter each option on a new line. Maximum {{ getMaxOptionsForGroupType() }} options will be used.
                  </p>
                  <p v-if="bulkOptionsText.trim()" class="text-slate-600">
                    Preview: {{ bulkOptionsText.split('\n').filter(line => line.trim()).length }} options will be created
                    {{ bulkOptionsText.split('\n').filter(line => line.trim()).length > getMaxOptionsForGroupType() ? 
                       `(${bulkOptionsText.split('\n').filter(line => line.trim()).length - getMaxOptionsForGroupType()} will be truncated)` : '' }}
                  </p>
                  <p v-if="bulkOptionsText.trim()" class="text-amber-600">
                    💡 After applying, you can switch back to individual mode to select the correct answer.
                  </p>
                </div>
              </div>
              
              <div class="flex gap-2">
                <UButton 
                  type="button" 
                  size="sm"
                  :disabled="savingSubQuestion || !bulkOptionsText.trim()"
                  @click="applyBulkOptions"
                >
                  Apply Options
                </UButton>
                <UButton 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  :disabled="savingSubQuestion"
                  @click="showBulkOptions = false"
                >
                  Cancel
                </UButton>
              </div>
            </div>

            <!-- Individual Options Mode -->
            <div v-else class="space-y-3">
              <div 
                v-for="(option, index) in subQuestionForm.options" 
                :key="index" 
                class="flex gap-3 items-center"
              >
                <div class="flex items-center">
                  <input
                    v-model="subQuestionForm.correct"
                    type="radio"
                    :value="index"
                    :name="`sub-correct-answer-${Date.now()}`"
                    class="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300"
                  >
                  <label class="ml-2 text-xs text-gray-500">Correct</label>
                </div>
                <UInput 
                  v-model="subQuestionForm.options[index]" 
                  :placeholder="`Option ${index + 1}`"
                  class="flex-1"
                  :disabled="savingSubQuestion"
                  required
                />
                <UButton 
                  v-if="subQuestionForm.options.length > 1"
                  type="button" 
                  color="error" 
                  variant="outline" 
                  size="sm"
                  :disabled="savingSubQuestion"
                  @click="removeSubQuestionOption(index)"
                >
                  Remove
                </UButton>
              </div>
              
              <div class="flex gap-2">
                <UButton 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  :disabled="savingSubQuestion || subQuestionForm.options.length >= getMaxOptionsForGroupType()"
                  @click="addSubQuestionOption"
                >
                  Add Option ({{ subQuestionForm.options.length }}/{{ getMaxOptionsForGroupType() }})
                </UButton>
                
                <UButton 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  :disabled="savingSubQuestion || subQuestionForm.options.length === 0"
                  @click="toggleBulkOptions"
                >
                  Switch to Bulk Mode
                </UButton>
              </div>
            </div>
          </UFormField>

          <!-- Explanation field -->
          <UFormField 
            label="Explanation" 
            hint="Provide an explanation for why the answer is correct or incorrect. This will be shown to users after they answer the question."
          >
            <AdminRichText 
              v-model="subQuestionForm.explanation"
              :disabled="savingSubQuestion"
              style="min-height: 120px;"
            />
          </UFormField>
        </UForm>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton 
            type="button" 
            color="gray" 
            variant="outline"
            :disabled="savingSubQuestion"
            @click="closeSubQuestionModal"
          >
            Cancel
          </UButton>
          <UButton 
            :loading="savingSubQuestion"
            :disabled="!isSubQuestionValid()"
            @click="saveSubQuestion"
          >
            {{ editingSubQuestionIndex !== null ? 'Update Sub-Question' : 'Add Sub-Question' }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Preview Modal -->
    <UModal 
      v-model:open="showPreviewModal" 
      title="Question Group Preview"
      :ui="{ content: 'w-full max-w-4xl h-[80vh]' }"
    >
      <template #body>
        <div v-if="groupData?.questions?.length > 0" class="h-full flex flex-col">
          <!-- Preview Navigation -->
          <div class="border-b border-gray-200 pb-4 mb-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold">{{ groupData.name }}</h4>
              <div class="text-sm text-gray-600">
                Question {{ previewQuestionIndex + 1 }} of {{ groupData.questions.length }}
              </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="(question, index) in groupData.questions"
                :key="index"
                class="w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm"
                :class="{
                  'border-primary-500 bg-primary-100 text-primary-700': index === previewQuestionIndex,
                  'border-gray-300 bg-gray-50 hover:bg-gray-100': index !== previewQuestionIndex
                }"
                @click="previewQuestionIndex = index"
              >
                {{ index + 1 }}
              </button>
            </div>
          </div>

          <!-- Preview Content -->
          <div class="flex-1 overflow-auto">
            <QuestionViewer 
              v-if="currentPreviewQuestion"
              :question="currentPreviewQuestion"
              mode="preview"
              :question-index="previewQuestionIndex"
            />
          </div>

          <!-- Preview Navigation Controls -->
          <div class="border-t border-gray-200 pt-4 mt-4">
            <div class="flex justify-between">
              <UButton 
                :disabled="previewQuestionIndex === 0" 
                color="gray"
                variant="outline"
                @click="previewQuestionIndex--"
              >
                ← Previous
              </UButton>
              
              <UButton 
                :disabled="previewQuestionIndex === groupData.questions.length - 1"
                color="primary"
                variant="outline"
                @click="previewQuestionIndex++"
              >
                Next →
              </UButton>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <div class="text-gray-400 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-gray-500">No questions to preview</p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end">
          <UButton 
            color="gray" 
            variant="outline"
            @click="closePreview"
          >
            Close Preview
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { addDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const localePath = useLocalePath()

const db = useFirestore()

// Get the slug from route params
const slug = computed(() => route.params.slug || 'new')
const isNewGroup = computed(() => slug.value === 'new')

// Set page title dynamically
useHead({
  title: computed(() => isNewGroup.value ? 'Create New Question Group - Admin' : 'Edit Question Group - Admin')
})

// Form state matching QuestionGroup interface
const groupForm = ref({
  name: '',
  type: '',
  published: false,
  archived: false
})

const saving = ref(false)
const saveError = ref('')

// Watch for type changes to clear sub-question form
watch(() => groupForm.value.type, (newType, oldType) => {
  if (newType !== oldType && oldType) {
    // Clear sub-question form when group type changes
    if (showSubQuestionModal.value) {
      initSubQuestionForm()
    }
  }
})

// Watch for archived status changes to automatically unpublish when archived
watch(() => groupForm.value.archived, (isArchived) => {
  if (isArchived && groupForm.value.published) {
    groupForm.value.published = false
  }
})

// For editing existing groups, fetch the group data
const groupData = ref<QuestionGroup | null>(null)
const groupLoading = ref(false)
const groupError = ref('')

// Fetch group data if editing existing group
const { data: fetchedGroup, pending: groupPending, error: fetchError } = isNewGroup.value 
  ? { data: ref(null), pending: ref(false), error: ref(null) }
  : useDocument(doc(db, 'question-groups', slug.value))

// Update reactive references based on fetch results
watch([fetchedGroup, groupPending, fetchError], ([data, pending, error]) => {
  if (!isNewGroup.value) {
    groupData.value = data
    groupLoading.value = pending
    groupError.value = error?.message || null
    
    // Prefill form when group data is loaded
    if (data) {
      groupForm.value = {
        name: data.name || '',
        type: data.type || '',
        published: data.published || false,
        archived: data.archived || false
      }
    }
  }
}, { immediate: true })

// Save group
const saveGroup = async (event) => {
  // Prevent default if it's a form event
  if (event?.preventDefault) {
    event.preventDefault()
  }
  
  if (!isFormValid()) return
  
  saving.value = true
  saveError.value = ''
  
  try {
    const groupDataToSave: QuestionGroup = {
      name: groupForm.value.name.trim(),
      type: groupForm.value.type,
      published: groupForm.value.published,
      archived: groupForm.value.archived,
      updatedAt: serverTimestamp()
    }
    
    if (isNewGroup.value) {
      groupDataToSave.createdAt = serverTimestamp()
      groupDataToSave.questions = []
      
      // Create new question group
      const docRef = await addDoc(collection(db, 'question-groups'), groupDataToSave)
      console.log('Question group created with ID:', docRef.id)
      
      // Navigate to edit page
      await navigateTo(localePath(`/admin/question-groups/${docRef.id}`))
    } else {
      // Update existing question group
      await updateDoc(doc(db, 'question-groups', slug.value), groupDataToSave)
      console.log('Question group updated')
    }
  } catch (error) {
    console.error('Error saving question group:', error)
    saveError.value = error.message || 'Failed to save question group'
  } finally {
    saving.value = false
  }
}

// Helper functions for validation
const isFormValid = () => {
  // Must have name and type
  return !!groupForm.value.name?.trim() && !!groupForm.value.type
}

// Sub-question modal state
const showSubQuestionModal = ref(false)
const editingSubQuestionIndex = ref(null)
const savingSubQuestion = ref(false)
const subQuestionSaveError = ref('')

// Sub-question form state matching QuestionGroup interface
const subQuestionForm = ref({
  imageUrl: '',
  text: '',
  question: '',
  options: [],
  correct: 0,
  explanation: ''
})

// Bulk options management
const bulkOptionsText = ref('')
const showBulkOptions = ref(false)

// Sub-question image upload state
const subQuestionImageUploadError = ref('')

// Preview modal state
const showPreviewModal = ref(false)
const previewQuestionIndex = ref(0)

// Preview computed properties
const currentPreviewQuestion = computed(() => {
  return groupData.value?.questions?.[previewQuestionIndex.value] || null
})

// Helper function to get max options based on group type
const getMaxOptionsForGroupType = () => {
  const groupType = groupForm.value.type
  if (groupType === 'image' || groupType === 'short_text' || groupType === 'blanks_8') {
    return 8
  }
  return 4 // For long_text and blanks_4
}

// Sub-question validation - options and correct are always required
const isSubQuestionValid = () => {
  // Options and correct answer are always required
  const filteredOptions = subQuestionForm.value.options.filter(o => o.trim())
  if (filteredOptions.length === 0 || subQuestionForm.value.correct >= filteredOptions.length) {
    return false
  }
  
  // Validate option count limits
  const maxOptions = getMaxOptionsForGroupType()
  if (filteredOptions.length > maxOptions) {
    return false
  }
  
  return true
}

// Sub-question options management
const addSubQuestionOption = () => {
  const maxOptions = getMaxOptionsForGroupType()
  if (subQuestionForm.value.options.length < maxOptions) {
    subQuestionForm.value.options.push('')
  }
}

const removeSubQuestionOption = (index) => {
  // Update correctAnswerIndex if needed
  if (subQuestionForm.value.correct === index) {
    subQuestionForm.value.correct = 0
  } else if (subQuestionForm.value.correct > index) {
    subQuestionForm.value.correct = subQuestionForm.value.correct - 1
  }
  
  subQuestionForm.value.options.splice(index, 1)
}

// Bulk options management
const toggleBulkOptions = () => {
  if (!showBulkOptions.value) {
    // Switching to bulk mode - populate textarea with current options
    bulkOptionsText.value = subQuestionForm.value.options.join('\n')
  }
  showBulkOptions.value = !showBulkOptions.value
}

const applyBulkOptions = () => {
  const lines = bulkOptionsText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  
  const maxOptions = getMaxOptionsForGroupType()
  
  // Take only up to the maximum allowed options
  const newOptions = lines.slice(0, maxOptions)
  
  // Update the options
  subQuestionForm.value.options = newOptions
  
  // Ensure correct answer index is valid
  if (subQuestionForm.value.correct >= newOptions.length) {
    subQuestionForm.value.correct = Math.max(0, newOptions.length - 1)
  }
  
  // Switch back to individual mode
  showBulkOptions.value = false
}

// Initialize sub-question form
const initSubQuestionForm = () => {
  subQuestionForm.value = {
    imageUrl: '',
    text: '',
    question: '',
    options: ['', ''], // Start with 2 empty options
    correct: 0,
    explanation: ''
  }
  subQuestionSaveError.value = ''
  subQuestionImageUploadError.value = ''
  bulkOptionsText.value = ''
  showBulkOptions.value = false
}

// Question management functions
const addQuestion = () => {
  editingSubQuestionIndex.value = null
  initSubQuestionForm()
  showSubQuestionModal.value = true
}

const editQuestion = (index) => {
  editingSubQuestionIndex.value = index
  const question = groupData.value?.questions?.[index]
  
  // Ensure options exist, initialize with empty options if not
  let existingOptions = question.options || ['', '']
  
  // Check if existing options exceed current limit and trim if necessary
  const maxOptions = getMaxOptionsForGroupType()
  if (existingOptions.length > maxOptions) {
    existingOptions = existingOptions.slice(0, maxOptions)
  }
  
  subQuestionForm.value = {
    imageUrl: question?.imageUrl || '',
    text: question?.text || '',
    question: question?.question || '',
    options: [...existingOptions],
    correct: Math.min(question?.correct || 0, existingOptions.length - 1), // Ensure correct index is valid
    explanation: question?.explanation || ''
  }
  
  subQuestionSaveError.value = ''
  subQuestionImageUploadError.value = ''
  bulkOptionsText.value = ''
  showBulkOptions.value = false
  showSubQuestionModal.value = true
}

const closeSubQuestionModal = () => {
  showSubQuestionModal.value = false
  editingSubQuestionIndex.value = null
  subQuestionSaveError.value = ''
  showBulkOptions.value = false
  bulkOptionsText.value = ''
  initSubQuestionForm()
}

const saveSubQuestion = async (event) => {
  // Prevent default if it's a form event
  if (event?.preventDefault) {
    event.preventDefault()
  }
  
  if (!isSubQuestionValid()) return
  
  savingSubQuestion.value = true
  subQuestionSaveError.value = ''
  
  try {
    // Prepare sub-question data
    const filteredOptions = subQuestionForm.value.options.filter(o => o.trim())
    const subQuestionData = {
      options: filteredOptions,
      correct: subQuestionForm.value.correct
    }
    
    // Add optional fields if they have values
    if (subQuestionForm.value.imageUrl?.trim()) {
      subQuestionData.imageUrl = subQuestionForm.value.imageUrl.trim()
    }
    if (subQuestionForm.value.text?.trim()) {
      subQuestionData.text = subQuestionForm.value.text.trim()
    }
    if (subQuestionForm.value.question?.trim()) {
      subQuestionData.question = subQuestionForm.value.question.trim()
    }
    if (subQuestionForm.value.explanation?.trim()) {
      subQuestionData.explanation = subQuestionForm.value.explanation.trim()
    }
    
    // Get current questions array
    const currentQuestions = [...(groupData.value?.questions || [])]
    
    if (editingSubQuestionIndex.value !== null) {
      // Update existing sub-question
      currentQuestions[editingSubQuestionIndex.value] = subQuestionData
    } else {
      // Add new sub-question
      currentQuestions.push(subQuestionData)
    }
    
    // Update group document
    await updateDoc(doc(db, 'question-groups', slug.value), {
      questions: currentQuestions,
      updatedAt: serverTimestamp()
    })
    
    console.log('Sub-question saved successfully')
    closeSubQuestionModal()
  } catch (error) {
    console.error('Error saving sub-question:', error)
    subQuestionSaveError.value = error.message || 'Failed to save sub-question'
  } finally {
    savingSubQuestion.value = false
  }
}

const duplicateQuestion = async (index) => {
  try {
    const currentQuestions = [...(groupData.value?.questions || [])]
    const { imageUrl, ...questionToDuplicate } = currentQuestions[index]
    
    // Create a deep copy of the question
    const duplicatedQuestion = {
      ...questionToDuplicate,
      options: [...(questionToDuplicate.options || [])],
      correct: questionToDuplicate.correct ?? 0
    }
    
    // Add the duplicated question after the original
    currentQuestions.splice(index + 1, 0, duplicatedQuestion)
    
    await updateDoc(doc(db, 'question-groups', slug.value), {
      questions: currentQuestions,
      updatedAt: serverTimestamp()
    })
    
    console.log('Sub-question duplicated successfully')
  } catch (error) {
    console.error('Error duplicating sub-question:', error)
    // Could add error handling here
  }
}

const deleteQuestion = async (index) => {
  if (!confirm('Are you sure you want to delete this sub-question?')) {
    return
  }
  
  try {
    const currentQuestions = [...(groupData.value?.questions || [])]
    currentQuestions.splice(index, 1)
    
    await updateDoc(doc(db, 'question-groups', slug.value), {
      questions: currentQuestions,
      updatedAt: serverTimestamp()
    })
    
    console.log('Sub-question deleted successfully')
  } catch (error) {
    console.error('Error deleting sub-question:', error)
    // Could add error handling here
  }
}

// Preview functions
const openPreview = () => {
  previewQuestionIndex.value = 0
  showPreviewModal.value = true
}

const closePreview = () => {
  showPreviewModal.value = false
  previewQuestionIndex.value = 0
}
</script> 