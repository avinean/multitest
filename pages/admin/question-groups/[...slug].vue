<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4">
        <UButton 
          to="/admin/question-groups" 
          color="gray" 
          variant="outline" 
          icon="i-heroicons-arrow-left"
        >
          Back to Question Groups
        </UButton>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isNewGroup ? 'Create New Question Group' : `Edit: ${groupData?.name || 'Question Group'}` }}
          </h2>
          <p class="text-gray-600 mt-1">
            {{ isNewGroup ? 'Add a new question group to the system' : 'Modify question group settings and content' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State (for editing existing group) -->
    <div v-if="!isNewGroup && groupLoading" class="max-w-2xl">
      <div class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="space-y-6">
          <div>
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"/>
            <div class="h-10 bg-gray-200 rounded"/>
          </div>
          <div>
            <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"/>
            <div class="h-20 bg-gray-200 rounded"/>
          </div>
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
    <div v-else-if="isNewGroup || (!groupLoading && groupData)" class="max-w-2xl">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <!-- Save Error message -->
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
              :items="[
                { value: 'image', label: 'Image-based Questions' },
                { value: 'long_text', label: 'Long Text Questions' },
                { value: 'short_text', label: 'Short Text Questions' },
                { value: 'blanks_8', label: 'Fill in Blanks (8 options)' },
                { value: 'blanks_4_vocabulary', label: 'Fill in Blanks (4 options) - Vocabulary' },
                { value: 'blanks_4_grammar', label: 'Fill in Blanks (4 options) - Grammar' }
              ]"
              :disabled="saving"
              placeholder="Select question group type"
              required
            />
          </UFormField>

          <UFormField v-if="groupData" label="Publication Status" hint="Control whether this question group is published and available for use.">
            <USwitch 
              v-model="groupForm.published"
              :disabled="saving"
            />
            <span class="text-sm" :class="groupForm.published ? 'text-green-600 font-medium' : 'text-gray-500'">
              {{ groupForm.published ? 'Published (Visible to users)' : 'Draft (Hidden from users)' }}
            </span>
          </UFormField>

                  <!-- Questions list for existing groups -->
          <div v-if="!isNewGroup" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
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
          </div>

          <!-- Info box for new groups -->
          <div v-if="isNewGroup" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex">
              <div class="text-blue-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Getting Started</h3>
                <p class="mt-1 text-sm text-blue-700">
                  Create and save this question group first, then you'll be able to add individual sub-questions to organize your content.
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <UButton 
            type="button" 
            color="gray" 
            variant="outline"
            :disabled="saving"
            @click="navigateTo('/admin/question-groups')"
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
            <!-- Image Upload Error -->
            <div v-if="subQuestionImageUploadError" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-700">{{ subQuestionImageUploadError }}</p>
            </div>
            
            <!-- Current Image Display -->
            <div v-if="subQuestionForm.imageUrl" class="mb-3">
              <div class="relative inline-block">
                <img 
                  :src="subQuestionForm.imageUrl" 
                  alt="Sub-question image"
                  class="max-w-full h-32 object-contain rounded-lg border border-gray-200"
                >
                <button
                  type="button"
                  :disabled="savingSubQuestion || uploadingSubQuestionImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
                  @click="removeSubQuestionImage"
                >
                  ✕
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">Current image</p>
            </div>
            
            <!-- File Input -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                ref="subQuestionImageInput"
                type="file"
                accept="image/*"
                :disabled="savingSubQuestion || uploadingSubQuestionImage"
                class="hidden"
                @change="handleSubQuestionImageSelect"
              >
              <div class="space-y-2">
                <div class="text-gray-400">
                  <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <UButton
                    type="button"
                    size="sm"
                    variant="outline"
                    :disabled="savingSubQuestion || uploadingSubQuestionImage"
                    :loading="uploadingSubQuestionImage"
                    @click="$refs.subQuestionImageInput.click()"
                  >
                    {{ subQuestionForm.imageUrl ? 'Change Image' : 'Select Image' }}
                  </UButton>
                </div>
                <p class="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
            
            <!-- Selected File Info -->
            <div v-if="subQuestionForm.imageFile" class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <span class="font-medium">Selected:</span> {{ subQuestionForm.imageFile.name }}
              <span class="text-gray-500 ml-2">
                ({{ Math.round(subQuestionForm.imageFile.size / 1024) }}KB)
              </span>
            </div>
          </UFormField>

          <!-- Text field -->
          <UFormField 
            label="Text Content" 
            hint="Text content for this sub-question."
          >
            <UTextarea 
              v-model="subQuestionForm.text" 
              placeholder="Enter text content..."
              rows="3"
              :disabled="savingSubQuestion"
              class="w-full"
            />
          </UFormField>

          <!-- Question field -->
          <UFormField 
            label="Question" 
            hint="The question text for this sub-question."
          >
            <UTextarea 
              v-model="subQuestionForm.question" 
              placeholder="Enter your question here..."
              rows="2"
              :disabled="savingSubQuestion"
              class="w-full"
            />
          </UFormField>

          <!-- Answer Options (always required for all sub-questions) -->
          <UFormField 
            label="Answer Options *" 
            :hint="`Add answer options and select the correct one. Maximum ${getMaxOptionsForGroupType()} options allowed for ${groupForm.type} type.`"
          >
            <div class="space-y-3">
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
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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
                  color="red" 
                  variant="outline" 
                  size="sm"
                  :disabled="savingSubQuestion"
                  @click="removeSubQuestionOption(index)"
                >
                  Remove
                </UButton>
              </div>
            </div>
          </UFormField>
          
          <UButton 
            type="button" 
            variant="outline" 
            size="sm" 
            :disabled="savingSubQuestion || subQuestionForm.options.length >= getMaxOptionsForGroupType()"
            @click="addSubQuestionOption"
          >
            Add Option ({{ subQuestionForm.options.length }}/{{ getMaxOptionsForGroupType() }})
          </UButton>
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
  </div>
</template>

<script setup>
import { addDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { useDocument, useFirestore, useFirebaseStorage } from 'vuefire'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const db = useFirestore()
const storage = useFirebaseStorage()

// Get the slug from route params
const slug = computed(() => route.params.slug?.[0] || 'new')
const isNewGroup = computed(() => slug.value === 'new')

// Set page title dynamically
useHead({
  title: computed(() => isNewGroup.value ? 'Create New Question Group - Admin' : 'Edit Question Group - Admin')
})

// Form state matching QuestionGroup interface
const groupForm = ref({
  name: '',
  type: '',
  published: false
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

// For editing existing groups, fetch the group data
const groupData = ref(null)
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
        published: data.published || false
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
    const groupDataToSave = {
      name: groupForm.value.name.trim(),
      type: groupForm.value.type,
      published: groupForm.value.published,
      updatedAt: serverTimestamp()
    }
    
    if (isNewGroup.value) {
      groupDataToSave.createdAt = serverTimestamp()
      groupDataToSave.questions = []
      
      // Create new question group
      const docRef = await addDoc(collection(db, 'question-groups'), groupDataToSave)
      console.log('Question group created with ID:', docRef.id)
      
      // Navigate to edit page
      await navigateTo(`/admin/question-groups/${docRef.id}`)
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
  imageFile: null,
  text: '',
  question: '',
  options: [],
  correct: 0
})

// Sub-question image upload state
const uploadingSubQuestionImage = ref(false)
const subQuestionImageUploadError = ref('')

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

// Initialize sub-question form
const initSubQuestionForm = () => {
  subQuestionForm.value = {
    imageUrl: '',
    imageFile: null,
    text: '',
    question: '',
    options: ['', ''], // Start with 2 empty options
    correct: 0
  }
  subQuestionSaveError.value = ''
  subQuestionImageUploadError.value = ''
}

// Sub-question image upload functions
const handleSubQuestionImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      subQuestionImageUploadError.value = 'Please select a valid image file'
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      subQuestionImageUploadError.value = 'Image size must be less than 5MB'
      return
    }
    
    subQuestionForm.value.imageFile = file
    subQuestionImageUploadError.value = ''
  }
}

const uploadSubQuestionImage = async () => {
  if (!subQuestionForm.value.imageFile) return null
  
  uploadingSubQuestionImage.value = true
  subQuestionImageUploadError.value = ''
  
  try {
    // Create a unique filename
    const filename = `question-images/${Date.now()}-${subQuestionForm.value.imageFile.name}`
    const imageRef = storageRef(storage, filename)
    
    // Upload the file
    await uploadBytes(imageRef, subQuestionForm.value.imageFile)
    
    // Get download URL
    const downloadURL = await getDownloadURL(imageRef)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading sub-question image:', error)
    subQuestionImageUploadError.value = error.message || 'Failed to upload image'
    return null
  } finally {
    uploadingSubQuestionImage.value = false
  }
}

const removeSubQuestionImage = async () => {
  if (subQuestionForm.value.imageUrl) {
    try {
      // Extract storage path from URL to delete the old image
      const imageRef = storageRef(storage, subQuestionForm.value.imageUrl)
      await deleteObject(imageRef)
    } catch (error) {
      console.log('Could not delete old sub-question image:', error)
      // Don't throw error as the main operation should continue
    }
  }
  
  subQuestionForm.value.imageUrl = ''
  subQuestionForm.value.imageFile = null
  subQuestionImageUploadError.value = ''
}

// Question management functions
const addQuestion = () => {
  editingSubQuestionIndex.value = null
  initSubQuestionForm()
  showSubQuestionModal.value = true
}

const editQuestion = (index) => {
  editingSubQuestionIndex.value = index
  const question = groupData.value.questions[index]
  
  // Ensure options exist, initialize with empty options if not
  let existingOptions = question.options || ['', '']
  
  // Check if existing options exceed current limit and trim if necessary
  const maxOptions = getMaxOptionsForGroupType()
  if (existingOptions.length > maxOptions) {
    existingOptions = existingOptions.slice(0, maxOptions)
  }
  
  subQuestionForm.value = {
    imageUrl: question.imageUrl || '',
    imageFile: null,
    text: question.text || '',
    question: question.question || '',
    options: [...existingOptions],
    correct: Math.min(question.correct || 0, existingOptions.length - 1) // Ensure correct index is valid
  }
  
  subQuestionSaveError.value = ''
  subQuestionImageUploadError.value = ''
  showSubQuestionModal.value = true
}

const closeSubQuestionModal = () => {
  showSubQuestionModal.value = false
  editingSubQuestionIndex.value = null
  subQuestionSaveError.value = ''
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
    // Upload image if a new file was selected
    let imageUrl = subQuestionForm.value.imageUrl
    if (subQuestionForm.value.imageFile) {
      imageUrl = await uploadSubQuestionImage()
      if (!imageUrl && subQuestionImageUploadError.value) {
        // If upload failed, don't save the sub-question
        return
      }
    }
    
    // Prepare sub-question data
    const filteredOptions = subQuestionForm.value.options.filter(o => o.trim())
    const subQuestionData = {
      options: filteredOptions,
      correct: subQuestionForm.value.correct
    }
    
    // Add optional fields if they have values
    if (imageUrl?.trim()) {
      subQuestionData.imageUrl = imageUrl.trim()
    }
    if (subQuestionForm.value.text?.trim()) {
      subQuestionData.text = subQuestionForm.value.text.trim()
    }
    if (subQuestionForm.value.question?.trim()) {
      subQuestionData.question = subQuestionForm.value.question.trim()
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
    const questionToDuplicate = currentQuestions[index]
    
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
</script> 