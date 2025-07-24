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

      <div v-else-if="filteredBlogPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BlogCard 
          v-for="post in filteredBlogPosts" 
          :key="post.id"
          :slug="post.id"
          :posterUrl="post.posterUrl"
          :categories="post.categories"
          :post="post[locale]"
          :reading-time="post.readingTime"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </div>
          
          <template v-if="!data || data.length === 0">
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

const { data, pending, error } = useCollection<BlogPost>(
  query(
    collection(db, 'blog'),
    where('published', '==', true),
    where(`${locale.value}.title`, '!=', ''),
    orderBy('createdAt', 'desc')
  )
)

const searchQuery = useRouteQuery<string>('search', '')

const filteredBlogPosts = computed(() => {
  let posts = data.value || []
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post => {
      const title = (post[locale.value].title || '').toLowerCase()
      const excerpt = (post[locale.value].excerpt || '').toLowerCase()
      const categories = (post.categories || []).join(' ').toLowerCase()
      
      return title.includes(query) || excerpt.includes(query) || categories.includes(query)
    })
  }
  return posts
})

const clearSearch = () => {
  searchQuery.value = ''
}
</script>
