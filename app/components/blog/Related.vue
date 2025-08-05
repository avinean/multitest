<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('blog.post.relatedPosts') }}</h2>
    
    <!-- Loading State -->
    <div v-if="!relatedPosts || relatedPosts.length === 0" class="text-center py-8">
      <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-heroicons-document-text" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
      </div>
      <p class="text-gray-500 dark:text-gray-400">{{ $t('blog.post.noRelatedPosts') }}</p>
    </div>
    
    <!-- Related Posts Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BlogCard
        v-for="post in relatedPosts"
        :key="post.id"
        :slug="post.id"
        :poster-url="post.posterUrl || ''"
        :categories="post.categories || []"
        :post="post[locale]"
        :reading-time="post.readingTime"
        :created-at="post.createdAt"
        class="transform transition-transform duration-200 hover:scale-105"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

const { locale } = useI18n()
const route = useRoute()
const db = useFirestore()

const { data } = useAsyncData(`blog-post-${route.params.slug}`, async () => (await getDoc(doc(db, 'blog', String(route.params.slug)))).data())

// Fetch related posts
const { data: allPosts } = useAsyncData(
  'all-blog-posts',
  async () => {
    const postsSnapshot = await getDocs(
      query(
        collection(db, 'blog'),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      )
    )
    return postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as BlogPost))
  }
)

// Compute related posts (3 random posts with at least one matching category)
const relatedPosts = computed(() => {
  if (!data.value || !allPosts.value) return []
  
  const currentPostCategories = data.value.categories || []
  if (currentPostCategories.length === 0) return []
  
  // Find posts with at least one matching category
  const postsWithMatchingCategories = allPosts.value.filter(post => {
    if (post.id === route.params.slug) return false // Exclude current post
    if (!post.categories || post.categories.length === 0) return false
    
    return post.categories.some(category => currentPostCategories.includes(category))
  })
  
  // Shuffle and take first 3
  const shuffled = postsWithMatchingCategories.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
})
</script>