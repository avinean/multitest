<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <!-- Loading State -->
    <div v-if="pending" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 animate-pulse">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"/>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"/>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"/>
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"/>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"/>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"/>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
        <div class="text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-red-800 dark:text-red-200 mb-2">{{ $t('blog.post.error.title') }}</h3>
        <p class="text-red-700 dark:text-red-300 mb-4">{{ error }}</p>
        <UButton 
          :to="$localePath('/blog')" 
          variant="outline"
          class="border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
        >
          {{ $t('blog.post.backToBlog') }}
        </UButton>
      </div>
    </div>

    <!-- Post Not Found -->
    <div v-else-if="!data" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center">
        <div class="text-yellow-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">{{ $t('blog.post.notFound.title') }}</h3>
        <p class="text-yellow-700 dark:text-yellow-300 mb-4">{{ $t('blog.post.notFound.message') }}</p>
        <UButton 
          :to="$localePath('/blog')" 
          variant="outline"
          class="border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
        >
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
          color="neutral" 
          variant="outline" 
          icon="i-heroicons-arrow-left"
          size="sm"
          class="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {{ $t('blog.post.backToBlog') }}
        </UButton>
      </div>
      <article class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <img 
          v-if="data.posterUrl" 
          :src="data.posterUrl" 
          :alt="data[locale].title || 'Blog post image'"
          class="w-full h-64 object-cover"
        >
        <!-- Post Header -->
        <header class="p-8 border-b border-gray-200 dark:border-gray-700">

          <!-- Post Meta -->
          <div class="flex items-center gap-3 mb-6">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300">
              {{ $t('blog.published') }}
            </span>
            <span v-if="data.readingTime" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
              {{ data.readingTime }} {{ $t('blog.readingTimeMinutes') }}
            </span>
            <span v-if="data.createdAt" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
              <NuxtTime :datetime="data.createdAt" month="long" day="numeric" year="numeric" />
            </span>
          </div>

          <!-- Post Title -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {{ data[locale].title || $t('blog.untitledPost') }}
          </h1>

          <!-- Post Excerpt -->
          <p v-if="data[locale].excerpt" class="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {{ data[locale].excerpt }}
          </p>

          <!-- Categories -->
          <div v-if="data.categories && data.categories.length > 0" class="flex flex-wrap gap-2">
            <UButton 
              v-for="category in data.categories" 
              :key="category"
              variant="link"
              size="sm"
              class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              :to="$localePath(`/blog?search=${category}`)"
            >
              #{{ category }}
            </UButton>
          </div>
        </header>

        <!-- Post Content -->
        <div class="p-8">
          <div class="space-y-4">
            <CmsSection v-for="section, key in data[locale].sections" :key :section="section" />
          </div>

          <!-- Post Footer -->
          <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                <span v-if="data[locale].updatedAt && data[locale].updatedAt !== data[locale].createdAt">
                  {{ $t('blog.post.lastUpdated') }}: <NuxtTime :datetime="data[locale].updatedAt" month="long" day="numeric" year="numeric" />
                </span>
              </div>
              
              <!-- Share buttons -->
              <div class="relative">
                <UDropdownMenu :items="shareOptions" :popper="{ placement: 'bottom-end' }">
                  <UButton variant="ghost" size="sm" icon="i-heroicons-share">
                    {{ $t('blog.post.share') }}
                  </UButton>
                </UDropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

const { locale } = useI18n()
const route = useRoute()
const db = useFirestore()

const { data, pending, error } = useAsyncData(`blog-post-${route.params.slug}`, async () => (await getDoc(doc(db, 'blog', String(route.params.slug)))).data())

// Toast functionality
const toast = useToast()

// Share functionality
const shareOptions = computed(() => {
  if (!data.value || process.server) return []
  
  const postTitle = data.value[locale.value].title || $t('blog.untitledPost')
  const postUrl = window.location.href
  const postDescription = data.value[locale.value].excerpt || ''
  
  return [
    {
      label: $t('share.copyLink'),
      icon: 'i-heroicons-link',
      onSelect: async () => {
        try {
          await navigator.clipboard.writeText(postUrl)
          toast.add({
            title: $t('share.linkCopied'),
            description: $t('share.linkCopiedDescription'),
            icon: 'i-heroicons-check-circle',
            color: 'success'
          })
        } catch (error) {
          toast.add({
            title: $t('share.copyError'),
            description: $t('share.copyErrorDescription'),
            icon: 'i-heroicons-exclamation-triangle',
            color: 'error'
          })
        }
      }
    },
    {
      label: $t('share.shareNative'),
      icon: 'i-heroicons-device-phone-mobile',
      onSelect: () => {
        if (navigator.share) {
          navigator.share({
            title: postTitle,
            text: postDescription,
            url: postUrl
          })
        }
      }
    },
    {
      label: $t('share.facebook'),
      icon: 'i-simple-icons-facebook',
      onSelect: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
        window.open(url, '_blank', 'width=600,height=400')
      }
    },
    {
      label: $t('share.twitter'),
      icon: 'i-simple-icons-twitter',
      onSelect: () => {
        const text = `${postTitle} - ${postDescription}`
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`
        window.open(url, '_blank', 'width=600,height=400')
      }
    },
    {
      label: $t('share.telegram'),
      icon: 'i-simple-icons-telegram',
      onSelect: () => {
        const text = `${postTitle}\n\n${postDescription}\n\n${postUrl}`
        const url = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`
        window.open(url, '_blank', 'width=600,height=400')
      }
    }
  ]
})

// SEO Meta setup using data from the blog post
useSeoMeta({
  title: computed(() => {
    if (!data.value) return 'Blog Post'
    return data.value[locale.value].seo?.title || data.value[locale.value].title || 'Blog Post'
  }),
  description: computed(() => {
    if (!data.value) return 'Read our latest blog post'
    return data.value[locale.value].seo?.description || data.value[locale.value].excerpt || 'Read our latest blog post'
  }),
  keywords: computed(() => data.value?.[locale.value]?.seo?.keywords || ''),
  ogTitle: computed(() => {
    if (!data.value) return 'Blog Post'
    return data.value[locale.value].seo?.title || data.value[locale.value].title || 'Blog Post'
  }),
  ogDescription: computed(() => {
    if (!data.value) return 'Read our latest blog post'
    return data.value[locale.value].seo?.description || data.value[locale.value].excerpt || 'Read our latest blog post'
  }),
  ogImage: computed(() => data.value?.[locale.value]?.seo?.ogImage || data.value?.[locale.value]?.posterUrl || ''),
  ogType: 'article',
  twitterCard: computed(() => data.value?.[locale.value]?.seo?.twitterCard || 'summary_large_image'),
  twitterTitle: computed(() => {
    if (!data.value) return 'Blog Post'
    return data.value[locale.value].seo?.title || data.value[locale.value].title || 'Blog Post'
  }),
  twitterDescription: computed(() => {
    if (!data.value) return 'Read our latest blog post'
    return data.value[locale.value].seo?.description || data.value[locale.value].excerpt || 'Read our latest blog post'
  }),
  twitterImage: computed(() => data.value?.[locale.value]?.seo?.ogImage || data.value?.[locale.value]?.posterUrl || '')
})
</script>