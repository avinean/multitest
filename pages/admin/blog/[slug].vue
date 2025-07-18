<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4">
        <UButton 
          :to="localePath('/admin/blog')" 
          color="gray" 
          variant="outline" 
          icon="i-heroicons-arrow-left"
        >
          {{ $t('admin.blog.backToBlog') }}
        </UButton>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isNewPost ? $t('admin.blog.createTitle') : `${$t('admin.blog.editTitle')}: ${postData?.title || $t('admin.blog.untitledPost')}` }}
          </h2>
          <p class="text-gray-600 mt-1">
            {{ isNewPost ? $t('admin.blog.createSubtitle') : $t('admin.blog.editSubtitle') }}
          </p>
        </div>
        <UButton 
          v-if="!isNewPost && postData?.published"
          color="primary" 
          variant="outline" 
          icon="i-heroicons-eye"
          @click="openPreview"
        >
          {{ $t('admin.blog.preview') }}
        </UButton>
      </div>
    </div>

    <!-- Loading State (for editing existing post) -->
    <div v-if="!isNewPost && postLoading" class="max-w-4xl">
      <div class="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"/>
          <span class="text-gray-600">{{ $t('admin.blog.loading') }}</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!isNewPost && postError" class="max-w-4xl">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex">
          <div class="text-red-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ $t('admin.blog.errorLoading') }}</h3>
            <p class="mt-1 text-sm text-red-700">{{ postError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form (shown when ready) -->
    <div v-else-if="isNewPost || (!postLoading && postData)" class="max-w-4xl mx-auto">
      <div v-if="saveError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex">
          <div class="text-red-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ isNewPost ? $t('admin.blog.errorCreating') : $t('admin.blog.errorUpdating') }}
            </h3>
            <p class="mt-1 text-sm text-red-700">{{ saveError }}</p>
          </div>
        </div>
      </div>

      <UForm 
        class="space-y-6" 
        :state="postForm" 
        :validate-on="[]"
        @submit="savePost"
      >
        <!-- Compact Header Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField :label="$t('admin.blog.title') + ' *'" hint="Give this blog post a descriptive title.">
            <UInput 
              v-model="postForm.title"
              :placeholder="$t('admin.blog.titlePlaceholder')"
              :disabled="saving"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('admin.blog.author')" hint="Enter the author name for this blog post.">
            <UInput 
              v-model="postForm.author"
              :placeholder="$t('admin.blog.authorPlaceholder')"
              :disabled="saving"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('admin.blog.excerpt')" hint="A brief summary or excerpt of the blog post content.">
            <UTextarea 
              v-model="postForm.excerpt"
              :placeholder="$t('admin.blog.excerptPlaceholder')"
              :disabled="saving"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('admin.blog.poster')" :hint="$t('admin.blog.posterHint')">
          <BaseImageUpload
            v-model="postForm.posterUrl"
            storage-path="blog"
            :disabled="saving"
            auto-upload
          />
        </UFormField>
        </div>

        <UFormField :label="$t('admin.blog.contentSections')" :hint="$t('admin.blog.contentSectionsHint')">
          <AdminSectionBuilder
            v-model="postForm.sections"
            :disabled="saving"
          />
        </UFormField>

        <UFormField label="Publication Status" hint="Control whether this blog post is published and visible to visitors.">
          <USwitch 
            v-model="postForm.published"
            :disabled="saving"
          />
          <span class="text-sm" :class="postForm.published ? 'text-green-600 font-medium' : 'text-gray-500'">
            {{ postForm.published ? $t('admin.blog.publishedStatus') : $t('admin.blog.draftStatus') }}
          </span>
        </UFormField>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 py-6 sticky bottom-0 bg-white">
          <UButton 
            type="button" 
            color="gray" 
            variant="outline"
            :disabled="saving"
            @click="navigateTo(localePath('/admin/blog'))"
          >
            {{ $t('admin.blog.cancel') }}
          </UButton>
          <UButton 
            type="submit"
            :loading="saving"
            :disabled="!isFormValid()"
          >
            {{ isNewPost ? $t('admin.blog.createPost') : $t('admin.blog.updatePost') }}
          </UButton>
        </div>
      </UForm>
    </div>
  </div>


</template>

<script setup>
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

const route = useRoute()
const localePath = useLocalePath()
const db = useFirestore()

const isNewPost = computed(() => route.params.slug === 'new')

// Post data state
const postData = ref(null)
const postLoading = ref(false)
const postError = ref(null)

// Form state
const postForm = ref({
  title: '',
  content: '', // Keep for backward compatibility
  excerpt: '',
  author: '',
  published: false,
  posterUrl: '',
  sections: [] // New CMS sections array
})

// Save state
const saving = ref(false)
const saveError = ref(null)

// Image upload state
const imageUploadError = ref('')



// Load existing post data
const loadPost = async () => {
  if (isNewPost.value) return

  postLoading.value = true
  postError.value = null

  try {
    const postDoc = await getDoc(doc(db, 'blog', String(route.params.slug)))
    
    if (postDoc.exists()) {
      postData.value = { id: postDoc.id, ...postDoc.data() }
      console.log('Loaded post data:', postData.value)
      
      // Populate form with existing data
      postForm.value = {
        title: postData.value.title || '',
        content: postData.value.content || '', // Keep for backward compatibility
        excerpt: postData.value.excerpt || '',
        author: postData.value.author || '',
        published: postData.value.published || false,
        posterUrl: postData.value.posterUrl || '',
        imageFile: null,
        sections: postData.value.sections || [] // Load sections if they exist
      }
      console.log('Populated form data:', postForm.value)
    } else {
      postError.value = 'Blog post not found'
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
    postError.value = error.message || 'Failed to load blog post'
  } finally {
    postLoading.value = false
  }
}



// Save post
const savePost = async () => {
  saving.value = true
  saveError.value = null

  try {
    const postData = {
      title: postForm.value.title.trim(),
      content: postForm.value.content.trim(), // Keep for backward compatibility
      excerpt: postForm.value.excerpt.trim(),
      author: postForm.value.author.trim(),
      published: postForm.value.published,
      sections: postForm.value.sections, // Save the sections array
      updatedAt: serverTimestamp()
    }

    // Add poster URL if it exists
    if (postForm.value.posterUrl?.trim()) {
      postData.posterUrl = postForm.value.posterUrl.trim()
    }

    if (isNewPost.value) {
      // Create new post
      postData.createdAt = serverTimestamp()
      const docRef = await addDoc(collection(db, 'blog'), postData)
      await navigateTo(localePath(`/admin/blog/${docRef.id}`))
    } else {
      // Update existing post
      await setDoc(doc(db, 'blog', String(route.params.slug)), postData, { merge: true })
      
      // Reload post data to get updated timestamps
      await loadPost()
    }
  } catch (error) {
    console.error('Error saving blog post:', error)
    saveError.value = error.message || 'Failed to save blog post'
  } finally {
    saving.value = false
  }
}

// Form validation
const isFormValid = () => {
  return postForm.value.title.trim() && postForm.value.sections.length > 0
}

// Preview function (placeholder for now)
const openPreview = () => {
  // TODO: Implement preview functionality
  console.log('Preview functionality to be implemented')
}

// Load post data on mount
onMounted(() => {
  if (!isNewPost.value) {
    loadPost()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  // Component handles its own cleanup
})
</script> 