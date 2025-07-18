<template>
  <div class="space-y-4">
    <!-- Image Upload Error -->
    <div v-if="imageUploadError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-700">{{ imageUploadError }}</p>
    </div>
    
    <!-- Combined Preview and Upload Area -->
    <div 
      class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
      :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <!-- Current Image Display -->
      <div v-if="imagePreview || model">
        <div class="relative inline-block">
          <img 
            :src="imagePreview || model" 
            :alt="alt"
            class="max-w-full object-cover rounded-lg border border-gray-200"
            :class="imageClass"
          >
          <button
            type="button"
            :disabled="disabled || uploading"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
            @click="removeImage"
          >
            ✕
          </button>
        </div>
      </div>
      
      <!-- Upload Interface (shown when no image or when dragging) -->
      <div v-if="!imagePreview && !model || isDragOver" class="space-y-2">
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
            :disabled="disabled || uploading"
            :loading="uploading"
            @click="fileInput?.click()"
          >
            {{ imagePreview ? 'Change Image' : (model ? 'Change Image' : 'Select Image') }}
          </UButton>
        </div>
        <p class="text-xs text-gray-500">
          {{ isDragOver ? 'Drop image here' : 'Drag and drop or click to select' }}
        </p>
        <p class="text-xs text-gray-500">
          JPEG, PNG, GIF, WebP up to 5MB
        </p>
      </div>
      
      <!-- Hidden File Input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        :disabled="disabled || uploading"
        class="hidden"
        @change="handleFileSelect"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { useFirebaseStorage } from 'vuefire'

interface Props {
  storagePath: string
  disabled?: boolean
  imageClass?: string
  alt?: string
  maxSize?: number
  autoUpload?: boolean
}

interface Emits {
  'upload-start': []
  'upload-success': [url: string]
  'upload-error': [error: Error]
  'remove': []
}

const model = defineModel<string>()

const {
  storagePath,
  disabled,
  imageClass = 'h-48 w-full',
  alt = 'Uploaded image',
  maxSize = 5 * 1024 * 1024, // 5MB
  autoUpload
} = defineProps<Props>()

const emit = defineEmits<Emits>()

const storage = useFirebaseStorage()

// Component state
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string>('')
const imageUploadError = ref<string>('')
const uploading = ref<boolean>(false)
const isDragOver = ref<boolean>(false)

// Helper function to extract storage path from download URL
const getStoragePathFromUrl = (url: string): string | null => {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/o\/(.+?)(\?|$)/)
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1])
    }
  } catch (error) {
    console.log('Could not extract storage path from URL:', error)
  }
  return null
}

// Handle drag and drop
const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    processSelectedFile(file)
  }
}

// Process selected file (common logic for both file input and drag & drop)
const processSelectedFile = (file: File) => {
  // Clean up previous preview URL
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = ''
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    imageUploadError.value = 'Please select a valid image file'
    selectedFile.value = null
    return
  }
  
  // Validate file size
  if (file.size > maxSize) {
    imageUploadError.value = `Image size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    selectedFile.value = null
    return
  }
  
  // Create preview URL for the selected image
  imagePreview.value = URL.createObjectURL(file)
  selectedFile.value = file
  imageUploadError.value = ''
  
  // Auto upload if enabled
  if (autoUpload) {
    uploadImage()
  }
}

// File selection handler
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null
  
  if (file) {
    processSelectedFile(file)
  } else {
    // No file selected, clear the form
    selectedFile.value = null
    imageUploadError.value = ''
  }
}

// Upload image to Firebase Storage
const uploadImage = async (): Promise<string | null> => {
  if (!selectedFile.value) return null
  
  uploading.value = true
  imageUploadError.value = ''
  emit('upload-start')
  
  try {
    // Create a unique filename
    const filename = `${storagePath}/${Date.now()}-${selectedFile.value.name}`
    const imageRef = storageRef(storage, filename)
    
    // Upload the file
    await uploadBytes(imageRef, selectedFile.value)
    
    // Get download URL
    const downloadURL = await getDownloadURL(imageRef)
    
    // Clean up preview URL
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
      imagePreview.value = ''
    }
    
    // Clear selected file
    selectedFile.value = null
    
    // Update model value
    model.value = downloadURL
    emit('upload-success', downloadURL)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload image'
    imageUploadError.value = errorMessage
    emit('upload-error', error instanceof Error ? error : new Error(errorMessage))
    return null
  } finally {
    uploading.value = false
  }
}

// Remove image
const removeImage = async (): Promise<void> => {
  // Delete from storage if URL exists
  if (model.value) {
    try {
      const storagePath = getStoragePathFromUrl(model.value)
      if (storagePath) {
        const imageRef = storageRef(storage, storagePath)
        await deleteObject(imageRef)
        console.log('Successfully deleted image from storage:', storagePath)
      }
    } catch (error) {
      console.log('Could not delete image from storage:', error)
      // Don't throw error as the main operation should continue
    }
  }
  
  // Clean up preview URL
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
    imagePreview.value = ''
  }
  
  // Clear selected file
  selectedFile.value = null
  imageUploadError.value = ''
  
  // Clear model value
  model.value = ''
  emit('remove')
}

// Cleanup on unmount
onUnmounted(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})

// Expose upload method for manual upload
defineExpose<{
  uploadImage: () => Promise<string | null>
  removeImage: () => Promise<void>
}>({
  uploadImage,
  removeImage
})
</script> 