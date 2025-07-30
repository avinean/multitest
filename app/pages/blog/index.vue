<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-600 to-blue-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {{ $t('blog.hero.title') }}
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            {{ $t('blog.hero.subtitle') }}
          </p>
          <div class="flex justify-center mb-8">
            <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-blue-200 animate-pulse" />
          </div>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div class="flex items-center space-x-4">
                <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6 text-gray-400" />
                <UInput
                  v-model="searchQuery"
                  :placeholder="$t('blog.search.placeholder')"
                  size="lg"
                  class="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-pulse">
          <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6"/>
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"/>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"/>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"/>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"/>
          <div class="flex items-center justify-between">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"/>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"/>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md mx-auto">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            {{ $t('blog.error.title') }}
          </h3>
          <p class="text-red-700 dark:text-red-300">{{ error }}</p>
        </div>
      </div>

      <!-- Blog Posts Grid -->
      <div v-else-if="filteredBlogPosts.length > 0">
        <!-- Stats Bar -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-12">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <UIcon name="i-heroicons-document-duplicate" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <span class="text-lg font-medium text-gray-900 dark:text-white">
                {{ $t('blog.showing') }} {{ filteredBlogPosts.length }} {{ $t('blog.of') }} {{ data?.length || 0 }} {{ $t('blog.posts') }}
                <span v-if="searchQuery" class="text-primary-600 dark:text-primary-400">{{ $t('blog.filtered') }}</span>
              </span>
            </div>
            <UButton v-if="searchQuery" variant="outline" @click="clearSearch" size="sm">
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-2" />
              {{ $t('blog.clearSearch') }}
            </UButton>
          </div>
        </div>

        <!-- Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="post in filteredBlogPosts" :key="post.id" class="group">
            <BlogCard 
              :slug="post.id"
              :posterUrl="post.posterUrl"
              :categories="post.categories"
              :post="post[locale]"
              :reading-time="post.readingTime"
              class="h-full transform transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          
          <template v-if="!data || data.length === 0">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {{ $t('blog.empty.noPosts') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-8">
              {{ $t('blog.empty.noPostsMessage') }}
            </p>
            <div class="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
              <UIcon name="i-heroicons-bell" class="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ $t('blog.empty.comingSoon') }}
              </p>
            </div>
          </template>
          
          <template v-else>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {{ $t('blog.empty.noResults') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-8">
              {{ $t('blog.empty.noResultsMessage') }}
            </p>
            <UButton variant="solid" @click="clearSearch" size="lg">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 mr-2" />
              {{ $t('blog.clearSearch') }}
            </UButton>
          </template>
        </div>
      </div>

      <!-- Newsletter CTA -->
      <div v-if="filteredBlogPosts.length > 0" class="mt-16 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center border border-primary-200 dark:border-primary-800">
        <UIcon name="i-heroicons-envelope" class="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('blog.newsletter.title') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          {{ $t('blog.newsletter.description') }}
        </p>
        <UButton
          :to="$localePath('/contact')"
          color="primary"
          size="lg"
        >
          {{ $t('blog.newsletter.button') }}
          <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
        </UButton>
      </div>
    </div>

    <!-- Floating Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-20"></div>
      <div class="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
      <div class="absolute bottom-40 left-20 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
      <div class="absolute bottom-20 right-10 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-25"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, query, where, orderBy } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

definePageMeta({
  title: 'Blog',
  description: 'Read our latest blog posts and insights about English learning'
})

// SEO Meta
useHead({
  title: computed(() => $t('blog.meta.title')),
  meta: [
    { name: 'description', content: computed(() => $t('blog.meta.description')) },
    { name: 'keywords', content: 'blog, english learning, tips, articles, education, language learning, grammar tips, vocabulary, english study' },
    { name: 'author', content: computed(() => $t('site.name')) },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: computed(() => $t('blog.meta.title')) },
    { property: 'og:description', content: computed(() => $t('blog.meta.description')) },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: computed(() => $t('site.name')) },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: '@englistry' },
    { name: 'twitter:title', content: computed(() => $t('blog.meta.title')) },
    { name: 'twitter:description', content: computed(() => $t('blog.meta.description')) }
  ]
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
