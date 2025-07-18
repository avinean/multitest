<template>
  <div class="bg-white rounded-xl shadow-sm p-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('blog.post.relatedPosts') }}</h2>
    
    <!-- Related Posts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BlogCard
        v-for="post in relatedPosts"
        :key="post.id"
        :slug="post.id"
        :poster-url="post.posterUrl"
        :categories="post.categories || []"
        :post="post[locale]"
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