<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4">
        <UButton 
          to="/admin/tests" 
          color="gray" 
          variant="outline" 
          icon="i-heroicons-arrow-left"
        >
          Back to Tests
        </UButton>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isNewTest ? 'Create New Test' : 'Edit Test' }}
          </h2>
          <p class="text-gray-600 mt-1">
            {{ isNewTest ? 'Add a new test to the system' : 'Modify test settings and content' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State (for editing existing test) -->
    <div v-if="!isNewTest && testLoading" class="max-w-2xl">
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
    <div v-else-if="!isNewTest && testError" class="max-w-2xl">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex">
          <div class="text-red-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error loading test</h3>
            <p class="mt-1 text-sm text-red-700">{{ testError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form (shown when ready) -->
    <div v-else-if="isNewTest || (!testLoading && testData)" class="max-w-2xl">
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
                Error {{ isNewTest ? 'creating' : 'updating' }} test
              </h3>
              <p class="mt-1 text-sm text-red-700">{{ saveError }}</p>
            </div>
          </div>
        </div>

        <UForm 
          class="space-y-6" 
          :state="testForm" 
          :validate-on="[]"
          @submit="saveTest"
        >
          <UFormField label="Test Name *" hint="Choose a clear, descriptive name that identifies the purpose of this test.">
            <UInput 
              id="testName"
              v-model="testForm.name" 
              placeholder="Enter a descriptive name for your test" 
              size="lg"
              :disabled="saving"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField label="Description (Optional)" hint="Optional description to help identify the test's content and purpose.">
            <UTextarea 
              id="testDescription"
              v-model="testForm.description" 
              placeholder="Provide a brief description of what this test covers..."
              :disabled="saving"
              rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Publication Status" hint="Controls whether this test is visible to users or remains as a draft.">
            <div class="flex items-center gap-3">
              <USwitch 
                v-model="testForm.published"
                :disabled="saving"
              />
              <div class="flex items-center gap-2">
                <UBadge 
                  :color="testForm.published ? 'success' : 'neutral'"
                  :variant="testForm.published ? 'solid' : 'outline'"
                  size="sm"
                >
                  {{ testForm.published ? 'Published' : 'Draft' }}
                </UBadge>
                <span class="text-sm text-gray-600">
                  {{ testForm.published ? 'Test is visible to users' : 'Test is hidden from users' }}
                </span>
              </div>
            </div>
          </UFormField>

          <!-- Questions info for existing tests -->
          <div v-if="!isNewTest && testData?.questions" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-700">Questions</h4>
              <UButton size="sm" @click="addQuestion">Add Question</UButton>
            </div>
            
            <!-- Questions List -->
            <div v-if="testData.questions.length > 0" class="space-y-3">
              <div 
                v-for="(question, index) in testData.questions" 
                :key="index"
                class="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Q{{ question.order || index + 1 }}
                      </span>
                      <h5 v-if="question.title" class="text-sm font-medium text-gray-900">
                        {{ question.title }}
                      </h5>
                    </div>
                    <p class="text-sm text-gray-700 mb-2">
                      {{ question.text.length > 100 ? question.text.substring(0, 100) + '...' : question.text }}
                    </p>
                    <div class="text-xs text-gray-500">
                      {{ question.options?.length || 0 }} options
                      <span v-if="question.correctAnswerIndex !== undefined">
                        • Correct: {{ question.options?.[question.correctAnswerIndex] || 'N/A' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-2 ml-4">
                    <UButton size="xs" variant="outline" @click="editQuestion(index)">
                      Edit
                    </UButton>
                    <UButton size="xs" color="red" variant="outline" @click="deleteQuestion(index)">
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
              <p class="text-sm text-gray-500 mb-3">No questions added yet</p>
              <UButton size="sm" @click="addQuestion">Add First Question</UButton>
            </div>
          </div>

          <!-- Add Questions button for new tests -->
          <div v-else-if="!isNewTest" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-3">Save the test first to start adding questions</p>
            </div>
          </div>

          <!-- Info box for new tests -->
          <div v-else-if="isNewTest" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex">
              <div class="text-blue-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Next Steps</h3>
                <p class="mt-1 text-sm text-blue-700">
                  After creating the test, you'll be able to add questions and configure test settings.
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <UButton 
              to="/admin/tests"
              color="gray" 
              variant="outline"
              :disabled="saving"
            >
              Cancel
            </UButton>
            <UButton 
              type="submit" 
              :loading="saving"
              :disabled="!testForm.name.trim()"
            >
              {{ isNewTest ? 'Create Test' : 'Update Test' }}
            </UButton>
          </div>
        </UForm>
      </div>
    </div>

    <!-- Question Modal -->
    <UModal 
      v-model:open="showQuestionModal" 
      :title="editingQuestionIndex !== null ? 'Edit Question' : 'Add New Question'"
      :ui="{ content: 'w-full max-w-2xl' }"
    >
      <template #body>
        <!-- Question save error -->
        <div v-if="questionSaveError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex">
            <div class="text-red-400">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error saving question</h3>
              <p class="mt-1 text-sm text-red-700">{{ questionSaveError }}</p>
            </div>
          </div>
        </div>

        <!-- Question Form -->
        <UForm 
          class="space-y-6" 
          :state="questionForm" 
          :validate-on="[]"
          @submit="saveQuestion"
        >
          <!-- Question Text -->
          <UFormField label="Question Text *" hint="Enter the main question text. This can include rich HTML formatting.">
            <UTextarea 
              v-model="questionForm.text" 
              placeholder="Enter your question here..."
              rows="3"
              required
              :disabled="savingQuestion"
              class="w-full"
            />
          </UFormField>

          <!-- Optional Fields -->
          <UFormField label="Title (Optional)" hint="An optional title for the question.">
            <UInput 
              v-model="questionForm.title" 
              placeholder="Question title"
              :disabled="savingQuestion"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Order" hint="Position of this question in the test.">
            <UInput 
              v-model="questionForm.order" 
              type="number"
              min="1"
              :disabled="savingQuestion"
              required
              class="w-full"
            />
          </UFormField>
          
          <UFormField label="Subtitle (Optional)" hint="An optional subtitle for the question.">
            <UInput 
              v-model="questionForm.subtitle" 
              placeholder="Question subtitle"
              :disabled="savingQuestion"
              class="w-full"
            />
          </UFormField>

          <!-- Image Upload -->
          <UFormField label="Question Image (Optional)" hint="Upload an image to accompany the question.">
            
            <!-- Image Upload Error -->
            <div v-if="imageUploadError" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-700">{{ imageUploadError }}</p>
            </div>
            
            <!-- Current Image Display -->
            <div v-if="questionForm.imageUrl" class="mb-3">
              <div class="relative inline-block">
                <img 
                  :src="questionForm.imageUrl" 
                  alt="Question image"
                  class="max-w-full h-32 object-contain rounded-lg border border-gray-200"
                >
                <button
                  type="button"
                  :disabled="savingQuestion || uploadingImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
                  @click="removeImage"
                >
                  ✕
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">Current image</p>
            </div>
            
            <!-- File Input -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <input
                ref="imageInput"
                type="file"
                accept="image/*"
                :disabled="savingQuestion || uploadingImage"
                class="hidden"
                @change="handleImageSelect"
              >
              <div class="space-y-2">
                <div class="text-gray-400">
                  <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <UButton
                    type="button"
                    size="sm"
                    variant="outline"
                    :disabled="savingQuestion || uploadingImage"
                    :loading="uploadingImage"
                    @click="$refs.imageInput.click()"
                  >
                    {{ questionForm.imageUrl ? 'Change Image' : 'Select Image' }}
                  </UButton>
                </div>
                <p class="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
            
            <!-- Selected File Info -->
            <div v-if="questionForm.imageFile" class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
              <span class="font-medium">Selected:</span> {{ questionForm.imageFile.name }}
              <span class="text-gray-500 ml-2">
                ({{ Math.round(questionForm.imageFile.size / 1024) }}KB)
              </span>
            </div>
          </UFormField>

          <!-- Answer Options -->
          <UFormField label="Answer Options *" hint="Add answer options and select the correct one. At least 2 options are required.">
            <div class="space-y-3">
              <div 
                v-for="(option, index) in questionForm.options" 
                :key="index" 
                class="flex gap-3 items-center"
              >
                <div class="flex items-center">
                  <input
                    v-model="questionForm.correctAnswerIndex"
                    type="radio"
                    :value="String(index)"
                    :name="`correct-answer-${Date.now()}`"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  >
                  <label class="ml-2 text-xs text-gray-500">Correct</label>
                </div>
                <UInput 
                  v-model="questionForm.options[index]" 
                  :placeholder="`Option ${index + 1}`"
                  class="flex-1"
                  required
                  :disabled="savingQuestion"
                />
                <UButton 
                  v-if="questionForm.options.length > 2"
                  type="button" 
                  color="red" 
                  variant="outline" 
                  size="sm"
                  :disabled="savingQuestion"
                  @click="removeOption(index)"
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
            :disabled="savingQuestion"
            @click="addOption"
          >
            Add Option
          </UButton>
          
        </UForm>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton 
            type="button" 
            color="gray" 
            variant="outline"
            :disabled="savingQuestion"
            @click="closeQuestionModal"
          >
            Cancel
          </UButton>
          <UButton 
            :loading="savingQuestion"
            :disabled="!questionForm.text.trim() || questionForm.options.filter(o => o.trim()).length < 2 || questionForm.correctAnswerIndex === null || questionForm.correctAnswerIndex === ''"
            @click="saveQuestion"
          >
            {{ editingQuestionIndex !== null ? 'Update Question' : 'Add Question' }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import { addDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { useDocument } from 'vuefire'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const db = inject('db')
const storage = inject('storage')

// Get the slug from route params
const slug = computed(() => route.params.slug?.[0] || 'new')
const isNewTest = computed(() => slug.value === 'new')

// Set page title dynamically
useHead({
  title: computed(() => isNewTest.value ? 'Create New Test - Admin' : 'Edit Test - Admin')
})

// Form state
const testForm = ref({
  name: '',
  description: '',
  published: false
})

const saving = ref(false)
const saveError = ref('')

// For editing existing tests, fetch the test data
const testData = ref(null)
const testLoading = ref(false)
const testError = ref('')

// Question modal state
const showQuestionModal = ref(false)
const editingQuestionIndex = ref(null)
const savingQuestion = ref(false)
const questionSaveError = ref('')

// Question form state
const questionForm = ref({
  text: '',
  title: '',
  subtitle: '',
  imageUrl: '', // Will store the uploaded image URL
  imageFile: null, // Will store the selected file
  options: ['', ''],
  correctAnswerIndex: null,
  order: 1
})

// Image upload state
const uploadingImage = ref(false)
const imageUploadError = ref('')

// Fetch test data if editing existing test
const { data: fetchedTest, pending: testPending, error: fetchError } = isNewTest.value 
  ? { data: ref(null), pending: ref(false), error: ref(null) }
  : useDocument(doc(db, 'tests', slug.value))

// Update reactive references based on fetch results
watch([fetchedTest, testPending, fetchError], ([data, pending, error]) => {
  if (!isNewTest.value) {
    testData.value = data
    testLoading.value = pending
    testError.value = error?.message || null
    
    // Prefill form when test data is loaded
    if (data) {
      testForm.value = {
        name: data.name || '',
        description: data.description || '',
        published: data.published || false
      }
    }
  }
}, { immediate: true })

// Save test
const saveTest = async (event) => {
  // Prevent default if it's a form event
  if (event?.preventDefault) {
    event.preventDefault()
  }
  
  if (!testForm.value.name.trim()) return
  
  saving.value = true
  saveError.value = ''
  
  try {
    const testData = {
      name: testForm.value.name,
      description: testForm.value.description,
      published: testForm.value.published,
      updatedAt: serverTimestamp()
    }
    
    if (isNewTest.value) {
      testData.createdAt = serverTimestamp()
      testData.questions = []
      
      // Create new test
      const docRef = await addDoc(collection(db, 'tests'), testData)
      console.log('Test created with ID:', docRef.id)
      
      // Navigate to edit page
      await navigateTo(`/admin/tests/${docRef.id}`)
    } else {
      // Update existing test
      await updateDoc(doc(db, 'tests', slug.value), testData)
      console.log('Test updated')
    }
  } catch (error) {
    console.error('Error saving test:', error)
    saveError.value = error.message || 'Failed to save test'
  } finally {
    saving.value = false
  }
}

// Question management functions
const initQuestionForm = () => {
  questionForm.value = {
    text: '',
    title: '',
    subtitle: '',
    imageUrl: '',
    imageFile: null,
    options: ['', ''],
    correctAnswerIndex: null,
    order: (testData.value?.questions?.length || 0) + 1
  }
  imageUploadError.value = ''
}

const addQuestion = () => {
  editingQuestionIndex.value = null
  initQuestionForm()
  showQuestionModal.value = true
}

const editQuestion = (index) => {
  editingQuestionIndex.value = index
  const question = testData.value.questions[index]
  
  questionForm.value = {
    text: question.text || '',
    title: question.title || '',
    subtitle: question.subtitle || '',
    imageUrl: question.imageUrl || '',
    imageFile: null, // Always null when editing - new uploads will set this
    options: [...(question.options || ['', ''])],
    correctAnswerIndex: question.correctAnswerIndex !== undefined ? String(question.correctAnswerIndex) : null,
    order: question.order ?? index + 1
  }
  
  imageUploadError.value = ''
  showQuestionModal.value = true
}

const closeQuestionModal = () => {
  showQuestionModal.value = false
  editingQuestionIndex.value = null
  questionSaveError.value = ''
  imageUploadError.value = ''
  initQuestionForm()
}

const addOption = () => {
  questionForm.value.options.push('')
}

const removeOption = (index) => {
  // Update correctAnswerIndex if needed
  if (questionForm.value.correctAnswerIndex === String(index)) {
    questionForm.value.correctAnswerIndex = null
  } else if (parseInt(questionForm.value.correctAnswerIndex) > index) {
    questionForm.value.correctAnswerIndex = String(parseInt(questionForm.value.correctAnswerIndex) - 1)
  }
  
  questionForm.value.options.splice(index, 1)
}

const saveQuestion = async (event) => {
  // Prevent default if it's a form event
  if (event?.preventDefault) {
    event.preventDefault()
  }
  
  if (!questionForm.value.text.trim() || 
      questionForm.value.options.filter(o => o.trim()).length < 2 || 
      questionForm.value.correctAnswerIndex === null || 
      questionForm.value.correctAnswerIndex === '') {
    return
  }
  
  savingQuestion.value = true
  questionSaveError.value = ''
  
  try {
    // Upload image if a new file was selected
    let imageUrl = questionForm.value.imageUrl
    if (questionForm.value.imageFile) {
      imageUrl = await uploadImage()
      if (!imageUrl && imageUploadError.value) {
        // If upload failed, don't save the question
        return
      }
    }
    
    // Prepare question data with proper data types
    const questionData = {
      text: questionForm.value.text.trim(),
      options: questionForm.value.options.filter(o => o.trim()),
      correctAnswerIndex: parseInt(questionForm.value.correctAnswerIndex),
      order: parseInt(questionForm.value.order) || 1
    }
    
    // Add optional fields if provided
    if (questionForm.value.title?.trim()) {
      questionData.title = questionForm.value.title.trim()
    }
    if (questionForm.value.subtitle?.trim()) {
      questionData.subtitle = questionForm.value.subtitle.trim()
    }
    if (imageUrl?.trim()) {
      questionData.imageUrl = imageUrl.trim()
    }
    
    // Get current questions array
    const currentQuestions = [...(testData.value?.questions || [])]
    
    if (editingQuestionIndex.value !== null) {
      // Update existing question
      currentQuestions[editingQuestionIndex.value] = questionData
    } else {
      // Add new question
      currentQuestions.push(questionData)
    }
    
    // Sort by order
    currentQuestions.sort((a, b) => (a.order || 0) - (b.order || 0))
    
    // Update test document
    await updateDoc(doc(db, 'tests', slug.value), {
      questions: currentQuestions,
      updatedAt: serverTimestamp()
    })
    
    console.log('Question saved successfully')
    closeQuestionModal()
  } catch (error) {
    console.error('Error saving question:', error)
    questionSaveError.value = error.message || 'Failed to save question'
  } finally {
    savingQuestion.value = false
  }
}

const deleteQuestion = async (index) => {
  if (!confirm('Are you sure you want to delete this question?')) {
    return
  }
  
  try {
    const currentQuestions = [...(testData.value?.questions || [])]
    currentQuestions.splice(index, 1)
    
    // Update order for remaining questions
    currentQuestions.forEach((q, i) => {
      q.order = i + 1
    })
    
    await updateDoc(doc(db, 'tests', slug.value), {
      questions: currentQuestions,
      updatedAt: serverTimestamp()
    })
    
    console.log('Question deleted successfully')
  } catch (error) {
    console.error('Error deleting question:', error)
    // Could add error handling here
  }
}

// Image upload functions
const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      imageUploadError.value = 'Please select a valid image file'
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      imageUploadError.value = 'Image size must be less than 5MB'
      return
    }
    
    questionForm.value.imageFile = file
    imageUploadError.value = ''
  }
}

const uploadImage = async () => {
  if (!questionForm.value.imageFile) return null
  
  uploadingImage.value = true
  imageUploadError.value = ''
  
  try {
    // Create a unique filename
    const filename = `test-images/${Date.now()}-${questionForm.value.imageFile.name}`
    const imageRef = storageRef(storage, filename)
    
    // Upload the file
    await uploadBytes(imageRef, questionForm.value.imageFile)
    
    // Get download URL
    const downloadURL = await getDownloadURL(imageRef)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    imageUploadError.value = error.message || 'Failed to upload image'
    return null
  } finally {
    uploadingImage.value = false
  }
}

const removeImage = async () => {
  if (questionForm.value.imageUrl) {
    try {
      // Extract storage path from URL to delete the old image
      const imageRef = storageRef(storage, questionForm.value.imageUrl)
      await deleteObject(imageRef)
    } catch (error) {
      console.log('Could not delete old image:', error)
      // Don't throw error as the main operation should continue
    }
  }
  
  questionForm.value.imageUrl = ''
  questionForm.value.imageFile = null
  imageUploadError.value = ''
}
</script> 