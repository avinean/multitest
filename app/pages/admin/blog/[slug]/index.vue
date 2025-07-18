<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4">
        <UButton 
          :to="localePath('/admin/blog')" 
          color="neutral" 
          variant="outline" 
          icon="i-heroicons-arrow-left"
        >
          {{ $t('admin.blog.backToBlog') }}
        </UButton>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isNewPost ? $t('admin.blog.createTitle') : `${$t('admin.blog.editTitle')}: ${postData?.[currentLocale]?.title || $t('admin.blog.untitledPost')}` }}
          </h2>
          <p class="text-gray-600 mt-1">
            {{ isNewPost ? $t('admin.blog.createSubtitle') : $t('admin.blog.editSubtitle') }}
          </p>
        </div>
        <UButton 
          v-if="!isNewPost && postData?.createdAt"
          color="primary" 
          variant="outline" 
          icon="i-heroicons-eye"
          :to="localePath(`/admin/blog/${route.params.slug}/preview`)"
        >
          {{ $t('admin.blog.preview') }}
        </UButton>
      </div>
    </div>

    <!-- Loading State (for editing existing post) -->
    <div v-if="!isNewPost && postLoading" class="max-w-6xl">
      <div class="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"/>
          <span class="text-gray-600">{{ $t('admin.blog.loading') }}</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!isNewPost && postError" class="max-w-6xl">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex">
          <div class="text-red-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ $t('admin.blog.errorLoading') }}</h3>
            <p class="mt-1 text-sm text-red-700">{{ postError }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form with Tabs (shown when ready) -->
    <div v-else-if="isNewPost || (!postLoading && postData)" class="max-w-6xl mx-auto">
      <div v-if="saveError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex">
          <div class="text-red-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ isNewPost ? $t('admin.blog.errorCreating') : $t('admin.blog.errorUpdating') }}
            </h3>
            <p class="mt-1 text-sm text-red-700">{{ saveError }}</p>
          </div>
        </div>
      </div>

      <!-- Language Selector -->
      <div class="mb-6">
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Content Language</h3>
              <p class="text-sm text-gray-600">Select the language for the content below</p>
            </div>
            <div class="flex gap-2">
              <UButton
                v-for="locale in availableLocales"
                :key="locale.code"
                :variant="currentLocale === locale.code ? 'solid' : 'outline'"
                :color="currentLocale === locale.code ? 'primary' : 'neutral'"
                @click="currentLocale = locale.code"
                :disabled="saving"
              >
                {{ locale.name }}
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <UForm 
        class="space-y-6" 
        :state="postForm" 
        :validate-on="[]"
        @submit="savePost"
      >
        <UFormField v-if="!postForm.createdAt" required label="Custom URL Slug" hint="Customize the URL slug for this blog post. Leave empty to auto-generate from the title.">
          <UInput 
            v-model="textToSlug"
            :disabled="saving"
            class="w-full"
          />
          <div class="mt-2 text-sm text-gray-600">
            <span class="font-medium">Final URL:</span> 
            <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ slug }}</code>
          </div>
        </UFormField>
        <UFormField label="Publication Status" hint="Control whether this blog post is published and visible to visitors.">
          <USwitch 
            v-model="postForm.published"
            :disabled="saving"
          />
          <span class="text-sm" :class="postForm.published ? 'text-green-600 font-medium' : 'text-gray-500'">
            {{ postForm.published ? $t('admin.blog.publishedStatus') : $t('admin.blog.draftStatus') }}
          </span>
        </UFormField>
        <UFormField :label="$t('admin.blog.poster')" :hint="$t('admin.blog.posterHint')">
          <BaseImageUpload
            v-model="postForm.posterUrl"
            storage-path="blog"
            :disabled="saving"
            auto-upload
          />
        </UFormField>
        <!-- Tabs -->
        <UTabs 
          :items="tabItems" 
          class="w-full"
          :unmount-on-hide="false"
        >
          <!-- Main Info Tab -->
          <template #main-info>
            <div class="space-y-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormField :label="$t('admin.blog.title') + ' *'" hint="Give this blog post a descriptive title.">
                  <UInput 
                    v-model="postForm[currentLocale].title"
                    :placeholder="$t('admin.blog.titlePlaceholder')"
                    :disabled="saving"
                    required
                    class="w-full"
                  />
                </UFormField>

                <UFormField :label="$t('admin.blog.excerpt')" hint="A brief summary or excerpt of the blog post content.">
                  <UTextarea 
                    v-model="postForm[currentLocale].excerpt"
                    :placeholder="$t('admin.blog.excerptPlaceholder')"
                    :disabled="saving"
                    :rows="3"
                    class="w-full"
                  />
                </UFormField>
              </div>
            </div>
          </template>

          <!-- Content Builder Tab -->
          <template #content-builder>
            <div class="space-y-6 py-4">
              <UFormField :label="$t('admin.blog.contentSections')" :hint="$t('admin.blog.contentSectionsHint')">
                <AdminSectionBuilder
                  v-model="postForm[currentLocale].sections"
                  :disabled="saving"
                />
              </UFormField>
            </div>
          </template>

          <!-- SEO Tab -->
          <template #seo>
            <div class="space-y-6 py-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormField label="Meta Title" hint="The title that appears in search engine results. Leave empty to use the blog post title.">
                  <UInput 
                    v-model="postForm[currentLocale].seo.title"
                    placeholder="Enter meta title..."
                    :disabled="saving"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Meta Description" hint="A brief description that appears in search engine results.">
                  <UTextarea 
                    v-model="postForm[currentLocale].seo.description"
                    placeholder="Enter meta description..."
                    :disabled="saving"
                    :rows="3"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Keywords" hint="Comma-separated keywords for SEO (optional).">
                  <UInput 
                    v-model="postForm[currentLocale].seo.keywords"
                    placeholder="keyword1, keyword2, keyword3"
                    :disabled="saving"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Canonical URL" hint="The canonical URL for this page (optional).">
                  <UInput 
                    v-model="postForm[currentLocale].seo.canonical"
                    placeholder="https://example.com/blog/post-slug"
                    :disabled="saving"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Open Graph Image" hint="Image URL for social media sharing (optional).">
                  <UInput 
                    v-model="postForm[currentLocale].seo.ogImage"
                    placeholder="https://example.com/image.jpg"
                    :disabled="saving"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Twitter Card Type" hint="Type of Twitter card to display.">
                  <USelect 
                    v-model="postForm[currentLocale].seo.twitterCard"
                    :items="twitterCardOptions"
                    :disabled="saving"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">SEO Preview</h4>
                <div class="space-y-2 text-sm">
                  <div class="font-medium text-blue-600">
                    {{ postForm[currentLocale].seo.title || postForm[currentLocale].title || 'Your Title Here' }}
                  </div>
                  <div class="text-gray-600">
                    {{ postForm[currentLocale].seo.description || postForm[currentLocale].excerpt || 'Your description here...' }}
                  </div>
                  <div class="text-green-600">
                    {{ postForm[currentLocale].seo.canonical || 'https://example.com/blog/post-slug' }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UTabs>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 py-6 sticky bottom-0 bg-white border-t">
          <UButton 
            type="button" 
            color="neutral" 
            variant="outline"
            :disabled="saving"
            @click="navigateTo(localePath('/admin/blog'))"
          >
            {{ $t('admin.blog.cancel') }}
          </UButton>
          <UButton 
            type="submit"
            :loading="saving"
            :disabled="!isFormValid()"
          >
            {{ isNewPost ? $t('admin.blog.createPost') : $t('admin.blog.updatePost') }}
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import slugify from 'slug'

definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

const route = useRoute()
const localePath = useLocalePath()
const db = useFirestore()

const isNewPost = computed(() => route.params.slug === 'new')

// Available locales for content editing
const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Українська' }
] as const

// Current editing locale
const currentLocale = ref<'en' | 'uk'>('en')
const textToSlug = ref('')
const slug = computed(() => slugify(textToSlug.value))

// Post data state
const postData = ref<BlogPost | null>(null)
const postLoading = ref(false)
const postError = ref<string | null>(null)

// Tab items configuration
const tabItems = [
  {
    slot: 'main-info',
    label: 'Main Info',
    icon: 'i-heroicons-information-circle'
  },
  {
    slot: 'content-builder',
    label: 'Content Builder',
    icon: 'i-heroicons-pencil-square'
  },
  {
    slot: 'seo',
    label: 'SEO',
    icon: 'i-heroicons-magnifying-glass'
  }
]

// Twitter card options
const twitterCardOptions = [
  { label: 'Summary', value: 'summary' },
  { label: 'Summary Large Image', value: 'summary_large_image' },
  { label: 'App', value: 'app' },
  { label: 'Player', value: 'player' }
]

// Initialize form structure for a locale
const initializeForm = () => ({
  title: '',
  content: '',
  excerpt: '',
  published: false,
  publishedAt: '',
  sections: [],
  seo: {
    title: '',
    description: '',
    keywords: '',
    canonical: '',
    ogImage: '',
    twitterCard: 'summary_large_image'
  }
})

// Form state - structured according to BlogPost type
const postForm = ref<BlogPost>({
  createdAt: '',
  updatedAt: '',
  posterUrl: '',
  published: false,
  publishedAt: '',
  ...(Object.fromEntries(availableLocales.map(({ code }) => [code, initializeForm()])) as Record<'en' | 'uk', any>)
})

// Save state
const saving = ref(false)
const saveError = ref<string | null>(null)

// Load existing post data
const loadPost = async () => {
  if (isNewPost.value) return

  postLoading.value = true
  postError.value = null

  try {
    const postDoc = await getDoc(doc(db, 'blog', String(route.params.slug)))
    
    if (postDoc.exists()) {
      const data = postDoc.data() as BlogPost
      postData.value = data
      // Store the ID separately for preview functionality
      const postId = postDoc.id
      console.log('Loaded post data:', postData.value)
      
      // Populate form with existing data
      postForm.value = {
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
        posterUrl: data.posterUrl || '',
        published: data.published || false,
        publishedAt: data.publishedAt || '',
        ...(Object.fromEntries(availableLocales.map(({ code }) => [code, 
            {
            title: data[code]?.title || '',
            content: data[code]?.content || '',
            excerpt: data[code]?.excerpt || '',
            sections: data[code]?.sections || [],
            seo: {
              title: data[code]?.seo?.title || '',
              description: data[code]?.seo?.description || '',
              keywords: data[code]?.seo?.keywords || '',
              canonical: data[code]?.seo?.canonical || '',
              ogImage: data[code]?.seo?.ogImage || '',
              twitterCard: data[code]?.seo?.twitterCard || 'summary_large_image'
            }
          }
        ])) as Record<'en' | 'uk', any>)
      }
      console.log('Populated form data:', postForm.value)
    } else {
      postError.value = 'Blog post not found'
    }
  } catch (error) {
    console.error('Error loading blog post:', error)
    postError.value = (error as Error).message || 'Failed to load blog post'
  } finally {
    postLoading.value = false
  }
}

// Save post
const savePost = async () => {
  saving.value = true
  saveError.value = null

  try {
    // Prepare data for saving
    const dataToSave = {
      posterUrl: postForm.value.posterUrl,
      published: postForm.value.published || false,
      publishedAt: postForm.value.publishedAt || '',
      ...(Object.fromEntries(availableLocales.map(({ code }) => [code, 
          {
          title: postForm.value[code]?.title || '',
          content: postForm.value[code]?.content || '',
          excerpt: postForm.value[code]?.excerpt || '',
          sections: postForm.value[code]?.sections || [],
          seo: {
            title: postForm.value[code]?.seo?.title || '',
            description: postForm.value[code]?.seo?.description || '',
            keywords: postForm.value[code]?.seo?.keywords || '',
            canonical: postForm.value[code]?.seo?.canonical || '',
            ogImage: postForm.value[code]?.seo?.ogImage || '',
            twitterCard: postForm.value[code]?.seo?.twitterCard || 'summary_large_image'
          }
        }
      ])) as Record<'en' | 'uk', any>),
      createdAt: isNewPost.value ? new Date().toISOString() : postData.value?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (isNewPost.value) {

      await setDoc(doc(db, 'blog', slug.value), dataToSave)
      await navigateTo(localePath(`/admin/blog/${slug.value}`))
    } else {
      // Update existing post
      await setDoc(doc(db, 'blog', String(route.params.slug)), dataToSave, { merge: true })
      
      // Reload post data to get updated timestamps
      await loadPost()
    }
  } catch (error) {
    console.error('Error saving blog post:', error)
    saveError.value = (error as Error).message || 'Failed to save blog post'
  } finally {
    saving.value = false
  }
}

// Form validation
const isFormValid = () => {
  return postForm.value[currentLocale.value]?.title?.trim()
  && slug.value.trim()
}

// Load post data on mount
onMounted(() => {
  if (!isNewPost.value) {
    loadPost()
  }
})
</script> 