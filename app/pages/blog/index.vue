<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            {{ $t('blog.hero.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {{ $t('blog.hero.subtitle') }}
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <UInput
                v-model="searchQuery"
                :placeholder="$t('blog.search.placeholder')"
                icon="i-heroicons-magnifying-glass"
                size="lg"
                class="w-full"
                :ui="{ 
                  base: 'relative block w-full',
                  input: 'pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70 focus:bg-white/20 focus:border-white/40',
                  icon: 'text-white/70'
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog Posts Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="pending" class="space-y-8">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"/>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-3"/>
          <div class="h-4 bg-gray-200 rounded w-full mb-3"/>
          <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"/>
          <div class="flex items-center gap-4">
            <div class="h-4 bg-gray-200 rounded w-24"/>
            <div class="h-4 bg-gray-200 rounded w-32"/>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <div class="text-red-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">{{ $t('blog.error.title') }}</h3>
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Blog Posts Grid -->
      <div v-else-if="filteredBlogPosts.length > 0" class="space-y-8">
        <!-- Results count -->
        <div class="text-center mb-8">
          <p class="text-gray-600">
            {{ $t('blog.showing') }} {{ filteredBlogPosts.length }} {{ $t('blog.of') }} {{ filteredBlogPosts.length }} {{ $t('blog.posts') }}
            <span v-if="searchQuery" class="font-medium text-blue-600">{{ $t('blog.filtered') }}</span>
          </p>
        </div>

        <!-- Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="post in filteredBlogPosts" 
            :key="post.id"
            class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <!-- Post Image -->
            <div class="h-48 overflow-hidden">
              <img 
                v-if="post.posterUrl" 
                :src="post.posterUrl" 
                :alt="post[locale].title || 'Blog post image'"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <div v-else class="h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <svg class="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
              </div>
            </div>

            <!-- Post Content -->
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ $t('blog.published') }}
                </span>
              </div>

              <h2 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {{ post[locale].title || $t('blog.untitledPost') }}
              </h2>

              <p v-if="post[locale].excerpt" class="text-gray-600 mb-4 line-clamp-3">
                {{ post[locale].excerpt }}
              </p>

              <div class="flex items-center justify-between text-sm text-gray-500">
                <span v-if="post.createdAt">
                  {{ formatDate(post.createdAt) }}
                </span>
                <UButton 
                  :to="`/blog/${post.id}`"
                  variant="ghost" 
                  size="sm"
                  class="text-blue-600 hover:text-blue-700"
                >
                  {{ $t('blog.readMore') }}
                  <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
                </UButton>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </div>
          
          <template v-if="!publishedBlogPosts || publishedBlogPosts.length === 0">
            <h3 class="text-xl font-medium text-gray-900 mb-2">{{ $t('blog.empty.noPosts') }}</h3>
            <p class="text-gray-500">{{ $t('blog.empty.noPostsMessage') }}</p>
          </template>
          
          <template v-else>
            <h3 class="text-xl font-medium text-gray-900 mb-2">{{ $t('blog.empty.noResults') }}</h3>
            <p class="text-gray-500 mb-4">{{ $t('blog.empty.noResultsMessage') }}</p>
            <UButton variant="outline" @click="clearSearch">
              {{ $t('blog.clearSearch') }}
            </UButton>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, query, where, orderBy } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

definePageMeta({
  title: 'Blog',
  description: 'Read our latest blog posts and insights'
})

const { locale } = useI18n()
const db = useFirestore()

// Fetch only published blog posts
const { data, pending, error } = useCollection<BlogPost>(
  query(
    collection(db, 'blog'),
    where('published', '==', true),
    orderBy('createdAt', 'desc')
  )
)

const searchQuery = ref('')
const filteredBlogPosts = computed(() => {
  if (!searchQuery.value) return data.value
  
  const query = searchQuery.value.toLowerCase()
  return data.value.filter(post => {
    const title = (post[locale.value].title || '').toLowerCase()
    const excerpt = (post[locale.value].excerpt || '').toLowerCase()
    
    return title.includes(query) || excerpt.includes(query)
  })
})

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

const clearSearch = () => {
  searchQuery.value = ''
}
</script>
