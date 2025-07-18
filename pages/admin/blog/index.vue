<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ $t('admin.blog.title') }}</h2>
          <p class="text-gray-600 mt-1">{{ $t('admin.blog.subtitle') }}</p>
        </div>
        <div>
          <UButton :to="$localePath('/admin/blog/new')" size="lg">
            {{ $t('admin.blog.create') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <UInput 
          v-model="searchQuery"
          :placeholder="$t('admin.blog.search')"
          icon="i-heroicons-magnifying-glass"
          size="md"
        />
        <USelect 
          v-model="selectedStatus"
          :items="statusOptions"
          :placeholder="$t('admin.blog.filterByStatus')"
          size="md"
        />
        <UButton 
          v-if="hasActiveFilters"
          variant="ghost" 
          color="error"
          size="md"
          @click="clearFilters"
        >
          {{ $t('admin.blog.clearFilters') }}
        </UButton>
      </div>
      
      <!-- Results count -->
      <div v-if="!blogPostsLoading && blogPosts" class="mt-3 text-sm text-gray-600">
        {{ $t('admin.blog.showing') }} {{ filteredBlogPosts.length }} {{ $t('admin.blog.of') }} {{ blogPosts.length }} blog posts
        <span v-if="hasActiveFilters" class="font-medium">{{ $t('admin.blog.filtered') }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="blogPostsLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-3"/>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"/>
        <div class="h-4 bg-gray-200 rounded w-1/4"/>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="blogPostsError" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex">
        <div class="text-red-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ $t('admin.blog.errorLoading') }}</h3>
          <p class="mt-1 text-sm text-red-700">{{ blogPostsError }}</p>
        </div>
      </div>
    </div>

    <!-- Blog Posts List -->
    <div v-else-if="filteredBlogPosts.length > 0" class="space-y-4">
      <div 
        v-for="post in filteredBlogPosts" 
        :key="post.id"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex gap-4">
          <!-- Post Image -->
          <div class="w-20 h-20 flex-shrink-0">
            <img 
              v-if="post.posterUrl" 
              :src="post.posterUrl" 
              :alt="post.title || 'Blog post image'"
              class="w-full h-full object-cover rounded-lg"
            >
            <div v-else class="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
            </div>
          </div>
          
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ post.title || $t('admin.blog.untitledPost') }}</h3>
              <UBadge 
                :color="post.published ? 'success' : 'neutral'"
                :variant="post.published ? 'solid' : 'outline'"
                size="sm"
              >
                {{ post.published ? $t('admin.blog.published') : $t('admin.blog.draft') }}
              </UBadge>
            </div>
            <div v-if="post.excerpt" class="text-gray-600 mb-3 line-clamp-2">
              {{ post.excerpt }}
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>ID: {{ post.id }}</span>
              <span v-if="post.author">{{ $t('admin.blog.author') }}: {{ post.author }}</span>
              <span v-if="post.createdAt">{{ $t('admin.blog.created') }}: {{ new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleDateString() }}</span>
              <span v-if="post.updatedAt">{{ $t('admin.blog.updated') }}: {{ new Date(post.updatedAt?.toDate?.() || post.updatedAt).toLocaleDateString() }}</span>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <UButton 
              :to="`/admin/blog/${post.id}`"
              size="sm" 
              variant="outline"
            >
              {{ $t('admin.blog.edit') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        </svg>
      </div>
      <!-- No posts at all -->
      <template v-if="!blogPosts || blogPosts.length === 0">
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('admin.blog.noPostsFound') }}</h3>
        <p class="text-gray-500 mb-6">{{ $t('admin.blog.noPostsMessage') }}</p>
        <UButton :to="$localePath('/admin/blog/new')">
          {{ $t('admin.blog.createFirst') }}
        </UButton>
      </template>
      <!-- No filtered results -->
      <template v-else>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('admin.blog.noMatchingFilters') }}</h3>
        <p class="text-gray-500 mb-6">{{ $t('admin.blog.adjustFilters') }}</p>
        <UButton variant="outline" @click="clearFilters">
          {{ $t('admin.blog.clearFilters') }}
        </UButton>
      </template>
    </div>
  </div>
</template>

<script setup>
import { collection } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

const db = useFirestore()

const { data: blogPosts, pending: blogPostsLoading, error: blogPostsError } = useCollection(
  collection(db, 'blog')
)

// Filter state
const searchQuery = ref('')
const selectedStatus = ref('')

const statusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' }
]

// Computed properties
const filteredBlogPosts = computed(() => {
  if (!blogPosts.value) return []
  
  return blogPosts.value.filter(post => {
    // Search by title
    const matchesSearch = !searchQuery.value || 
      (post.title || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filter by status
    const matchesStatus = !selectedStatus.value || 
      (selectedStatus.value === 'published' && post.published) ||
      (selectedStatus.value === 'draft' && !post.published)
    
    return matchesSearch && matchesStatus
  })
})

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedStatus.value)
})

// Filter functions
const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
}
</script>
