<template>
  <article class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
    <!-- Post Image -->
    <div class="h-48 overflow-hidden">
      <img 
        v-if="posterUrl" 
        :src="posterUrl" 
        :alt="post.title || 'Blog post image'"
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
        <span v-if="readingTime" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <UIcon name="i-heroicons-clock" class="w-3 h-3 mr-1" />
          {{ readingTime }} {{ $t('blog.readingTimeMinutes') }}
        </span>
      </div>

      <h2 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
        {{ post.title || $t('blog.untitledPost') }}
      </h2>

      <p v-if="post.excerpt" class="text-gray-600 mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Categories -->
      <div v-if="categories && categories.length > 0" class="mb-4 flex flex-wrap">
        <UButton 
          v-for="category in categories" 
          :key="category"
          variant="link"
          size="xs"
          :to="$localePath(`/blog?search=${category}`)"
        >
          #{{ category }}
        </UButton>
        <span v-if="categories.length > 5" class="text-sm text-gray-500">
          +{{ categories.length - 5 }}
        </span>
      </div>

      <div class="flex items-center justify-between text-sm text-gray-500">
        <UButton 
          :to="$localePath(`/blog/${slug}`)"
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