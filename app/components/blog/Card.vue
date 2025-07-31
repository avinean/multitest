<template>
  <article class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg dark:shadow-gray-900/25 hover:dark:shadow-gray-900/40 transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700">
    <!-- Post Image -->
    <div class="h-48 overflow-hidden">
      <img 
        v-if="posterUrl" 
        :src="posterUrl" 
        :alt="post.title || 'Blog post image'"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      >
      <div v-else class="h-full bg-gradient-to-br from-primary-100 to-zinc-100 dark:from-primary-900/30 dark:to-zinc-800 flex items-center justify-center">
        <svg class="w-16 h-16 text-primary-400 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        </svg>
      </div>
    </div>

    <!-- Post Content -->
    <div class="p-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300">
          {{ $t('blog.published') }}
        </span>
        <span v-if="readingTime" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          <UIcon name="i-heroicons-clock" class="w-3 h-3 mr-1" />
          {{ readingTime }} {{ $t('blog.readingTimeMinutes') }}
        </span>
      </div>

      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {{ post.title || $t('blog.untitledPost') }}
      </h2>

      <p v-if="post.excerpt" class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Categories -->
      <div v-if="categories && categories.length > 0" class="mb-4 flex flex-wrap">
        <UButton 
          v-for="category in categories" 
          :key="category"
          variant="link"
          size="xs"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          :to="$localePath(`/blog?search=${category}`)"
        >
          #{{ category }}
        </UButton>
        <span v-if="categories.length > 5" class="text-sm text-gray-500 dark:text-gray-400">
          +{{ categories.length - 5 }}
        </span>
      </div>

      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <UButton 
          :to="$localePath(`/blog/${slug}`)"
          variant="ghost" 
          size="sm"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-200"
        >
          {{ $t('blog.readMore') }}
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
        </UButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  slug: string
  posterUrl: string
  categories: string[]
  post: BlogPost['uk' | 'en']
  readingTime?: number
}>()
</script>