<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <!-- Loading State -->
    <div v-if="postLoading" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-xl shadow-sm p-8 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4 mb-6"/>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"/>
        <div class="h-4 bg-gray-200 rounded w-1/3 mb-8"/>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded w-full"/>
          <div class="h-4 bg-gray-200 rounded w-full"/>
          <div class="h-4 bg-gray-200 rounded w-2/3"/>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="postError" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div class="text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-red-800 mb-2">{{ $t('blog.post.error.title') }}</h3>
        <p class="text-red-700 mb-4">{{ postError }}</p>
        <UButton :to="$localePath('/blog')" variant="outline">
          {{ $t('blog.post.backToBlog') }}
        </UButton>
      </div>
    </div>

    <!-- Post Not Found -->
    <div v-else-if="!postData" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
        <div class="text-yellow-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-yellow-800 mb-2">{{ $t('blog.post.notFound.title') }}</h3>
        <p class="text-yellow-700 mb-4">{{ $t('blog.post.notFound.message') }}</p>
        <UButton :to="$localePath('/blog')" variant="outline">
          {{ $t('blog.post.backToBlog') }}
        </UButton>
      </div>
    </div>

    <!-- Blog Post Content -->
    <div v-else class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Back to Blog -->
      <div class="mb-8">
        <UButton 
          :to="$localePath('/blog')" 
          color="gray" 
          variant="outline" 
          icon="i-heroicons-arrow-left"
          size="sm"
        >
          {{ $t('blog.post.backToBlog') }}
        </UButton>
      </div>

      <!-- Post Header -->
      <article class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Post Image -->
        <div class="h-64 overflow-hidden">
          <img 
            v-if="postData.posterUrl" 
            :src="postData.posterUrl" 
            :alt="postData.title || 'Blog post image'"
            class="w-full h-full object-cover"
          >
          <div v-else class="h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <svg class="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </div>
        </div>

        <!-- Post Content -->
        <div class="p-8">
          <!-- Post Meta -->
          <div class="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {{ $t('blog.published') }}
            </span>
            <span v-if="postData.author">
              {{ $t('blog.by') }} {{ postData.author }}
            </span>
            <span v-if="postData.createdAt">
              {{ formatDate(postData.createdAt) }}
            </span>
          </div>

          <!-- Post Title -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {{ postData.title || $t('blog.untitledPost') }}
          </h1>

          <!-- Post Excerpt -->
          <div v-if="postData.excerpt" class="text-xl text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            {{ postData.excerpt }}
          </div>

          <!-- Post Content -->
        <div class="space-y-4">
          <CmsSection v-for="section, key in postData.sections" :key :section="section" />
        </div>

          <!-- Post Footer -->
          <div class="mt-12 pt-8 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">
                <span v-if="postData.updatedAt && postData.updatedAt !== postData.createdAt">
                  {{ $t('blog.post.lastUpdated') }}: {{ formatDate(postData.updatedAt) }}
                </span>
              </div>
              
              <!-- Share buttons (placeholder) -->
              <div class="flex gap-2">
                <UButton variant="ghost" size="sm" icon="i-heroicons-share">
                  {{ $t('blog.post.share') }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Related Posts (placeholder for future) -->
      <div class="mt-12">
        <div class="bg-white rounded-xl shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('blog.post.relatedPosts') }}</h2>
          <p class="text-gray-600">{{ $t('blog.post.relatedPostsMessage') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { doc, getDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

const route = useRoute()
const db = useFirestore()

// Post data state
const postData = ref(null)
const postLoading = ref(true)
const postError = ref(null)

// Load post data
const loadPost = async () => {
  postLoading.value = true
  postError.value = null

  try {
    const postDoc = await getDoc(doc(db, 'blog', String(route.params.slug)))
    
    if (postDoc.exists()) {
      const data = postDoc.data()
      
      // Only show published posts
      if (!data.published) {
        postError.value = 'Post not found'
        return
      }
      
      postData.value = { id: postDoc.id, ...data }
    } else {
      postData.value = null
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
    postError.value = error.message || 'Failed to load blog post'
  } finally {
    postLoading.value = false
  }
}

// Utility functions
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Load post on mount
onMounted(() => {
  loadPost()
})

// SEO Meta setup using data from the blog post
useSeoMeta({
  title: computed(() => {
    if (!postData.value) return 'Blog Post'
    return postData.value.seo?.title || postData.value.title || 'Blog Post'
  }),
  description: computed(() => {
    if (!postData.value) return 'Read our latest blog post'
    return postData.value.seo?.description || postData.value.excerpt || 'Read our latest blog post'
  }),
  keywords: computed(() => postData.value?.seo?.keywords || ''),
  canonical: computed(() => postData.value?.seo?.canonical || ''),
  ogTitle: computed(() => {
    if (!postData.value) return 'Blog Post'
    return postData.value.seo?.title || postData.value.title || 'Blog Post'
  }),
  ogDescription: computed(() => {
    if (!postData.value) return 'Read our latest blog post'
    return postData.value.seo?.description || postData.value.excerpt || 'Read our latest blog post'
  }),
  ogImage: computed(() => postData.value?.seo?.ogImage || postData.value?.posterUrl || ''),
  ogType: 'article',
  twitterCard: computed(() => postData.value?.seo?.twitterCard || 'summary_large_image'),
  twitterTitle: computed(() => {
    if (!postData.value) return 'Blog Post'
    return postData.value.seo?.title || postData.value.title || 'Blog Post'
  }),
  twitterDescription: computed(() => {
    if (!postData.value) return 'Read our latest blog post'
    return postData.value.seo?.description || postData.value.excerpt || 'Read our latest blog post'
  }),
  twitterImage: computed(() => postData.value?.seo?.ogImage || postData.value?.posterUrl || '')
})
</script>