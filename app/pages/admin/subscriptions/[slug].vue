<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4">
        <UButton 
          :to="localePath('/admin/subscriptions')" 
          color="neutral" 
          variant="outline" 
          icon="i-heroicons-arrow-left"
        >
          {{ t('common.back') }}
        </UButton>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? t('admin.subscriptions.editTitle') : t('admin.subscriptions.createTitle') }}
          </h2>
          <p class="text-gray-600 mt-1">
            {{ isEditing ? t('admin.subscriptions.editSubtitle') : t('admin.subscriptions.createSubtitle') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State (for editing existing subscription) -->
    <div v-if="!isEditing && loading" class="max-w-6xl">
      <div class="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"/>
          <span class="text-gray-600">{{ t('common.loading') }}</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!isEditing && error" class="max-w-6xl">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex">
          <div class="text-red-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ t('admin.subscriptions.errorLoading') }}</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form (shown when ready) -->
    <div v-else class="max-w-6xl mx-auto">
      <div v-if="saveError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex">
          <div class="text-red-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ isEditing ? t('admin.subscriptions.errorSaving') : t('admin.subscriptions.errorSaving') }}
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
              <h3 class="text-lg font-medium text-gray-900">{{ t('admin.subscriptions.contentLanguage') }}</h3>
              <p class="text-sm text-gray-600">{{ t('admin.subscriptions.selectLanguageHint') }}</p>
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
        :state="subscriptionForm" 
        :validate-on="[]"
        @submit="saveSubscription"
      >
        <!-- Basic Information -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-medium text-gray-900">
              {{ t('admin.subscriptions.basicInfo') }}
            </h2>
          </template>

          <div class="space-y-4">
            <UFormField :label="t('admin.subscriptions.published')" required>
              <USwitch
                v-model="subscriptionForm.published"
                :label="t('admin.subscriptions.publishedLabel')"
              />
            </UFormField>
            <UFormField :label="t('admin.subscriptions.price')" required>
              <UInput
                v-model="subscriptionForm.price"
                type="number"
                :placeholder="t('admin.subscriptions.pricePlaceholder')"
                required
                class="w-full"
              />
            </UFormField>
            <UFormField :label="t('admin.subscriptions.badge')">
              <USelect
                v-model="subscriptionForm.badge"
                :placeholder="t('admin.subscriptions.badgePlaceholder')"
                class="w-full"
                :items="['popular', 'pro', 'premium']"
              />
            </UFormField>
          </div>
        </UCard>

        <!-- Language-specific Content -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-medium text-gray-900">
              {{ t('admin.subscriptions.contentFor') }} {{ getCurrentLocaleName() }}
            </h2>
          </template>

          <div class="space-y-6">
            <!-- Title -->
            <div>
              <UFormField :label="t('admin.subscriptions.title')" required>
                <UInput
                  v-model="subscriptionForm[currentLocale].title"
                  :placeholder="t('admin.subscriptions.titlePlaceholder')"
                  required
                  class="w-full"
                />
              </UFormField>
            </div>

            <!-- Description -->
            <div>
              <UFormField :label="t('admin.subscriptions.description')" required>
                <UTextarea
                  v-model="subscriptionForm[currentLocale].description"
                  :placeholder="t('admin.subscriptions.descriptionPlaceholder')"
                  :rows="4"
                  required
                  class="w-full"
                />
              </UFormField>
            </div>

            <!-- Features -->
            <div>

              <div v-if="subscriptionForm[currentLocale].features.length === 0" class="text-center py-8">
                <UIcon name="i-heroicons-list-bullet" class="w-12 h-12 text-gray-400 mx-auto" />
                <p class="mt-2 text-gray-500">
                  {{ t('admin.subscriptions.noFeatures') }}
                </p>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="(feature, index) in subscriptionForm[currentLocale].features"
                  :key="index"
                  class="flex items-center gap-3"
                >
                  <UInput
                    v-model="subscriptionForm[currentLocale].features[index]"
                    :placeholder="t('admin.subscriptions.featurePlaceholder')"
                    class="flex-1"
                  />
                  <UButton
                    @click="removeFeature(index)"
                    color="error"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-trash"
                  />
                </div>
              </div>
              <div class="mt-4 flex items-center justify-end mb-4">
                <UButton
                  @click="addFeature"
                  color="primary"
                  variant="solid"
                  size="sm"
                  icon="i-heroicons-plus"
                >
                  {{ t('admin.subscriptions.addFeature') }}
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-4">
          <UButton
            :to="localePath('/admin/subscriptions')"
            variant="ghost"
            size="lg"
          >
            {{ t('common.cancel') }}
          </UButton>
          <UButton
            type="submit"
            color="primary"
            variant="solid"
            size="lg"
            :loading="saving"
            :disabled="saving"
          >
            <UIcon v-if="!saving" name="i-heroicons-check" class="w-5 h-5 mr-2" />
            {{ saving ? t('common.saving') : (isEditing ? t('common.save') : t('common.save')) }}
          </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import type { Subscription } from '#shared/types'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const db = useFirestore()

const isEditing = computed(() => route.params.slug !== 'new')
const subscriptionId = computed(() => isEditing.value ? route.params.slug as string : null)

// Available locales for content editing
const availableLocales = [
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Українська' }
] as const

// Current editing locale
const currentLocale = ref<'en' | 'uk'>('en')

// Subscription data state
const subscriptionData = ref<Subscription | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Initialize form structure for a locale
const initializeForm = () => ({
  title: '',
  description: '',
  features: [] as string[]
})

// Form state - structured according to Subscription type
const subscriptionForm = ref<Subscription>({
  published: false,
  price: 0,  
  createdAt: '',
  updatedAt: '',
  ...(Object.fromEntries(availableLocales.map(({ code }) => [code, initializeForm()])) as Record<'en' | 'uk', any>)
})

// Save state
const saving = ref(false)
const saveError = ref<string | null>(null)

// Helper functions
const getCurrentLocaleName = () => {
  return availableLocales.find(locale => locale.code === currentLocale.value)?.name || ''
}

const addFeature = () => {
  subscriptionForm.value[currentLocale.value].features.push('')
}

const removeFeature = (index: number) => {
  subscriptionForm.value[currentLocale.value].features.splice(index, 1)
}

// Load existing subscription data
const loadSubscription = async () => {
  if (!isEditing.value) return
  
  loading.value = true
  error.value = null

  try {
    const subscriptionDoc = await getDoc(doc(db, 'subscriptions', subscriptionId.value!))
    
    if (subscriptionDoc.exists()) {
      const data = subscriptionDoc.data() as Subscription
      subscriptionData.value = data
      
      // Populate form with existing data
      subscriptionForm.value = {
        published: data.published || false,
        price: data.price || 0,
        badge: data.badge,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
        ...(Object.fromEntries(availableLocales.map(({ code }) => [code, 
          {
            title: data[code]?.title || '',
            description: data[code]?.description || '',
            features: data[code]?.features || []
          }
        ])) as Record<'en' | 'uk', any>)
      }
    } else {
      error.value = t('admin.subscriptions.notFound')
    }
  } catch (err: any) {
    error.value = err.message || t('admin.subscriptions.errorLoading')
    console.error('Error loading subscription:', err)
  } finally {
    loading.value = false
  }
}

// Save subscription
const saveSubscription = async () => {
  saving.value = true
  saveError.value = null

  try {
    if (isEditing.value) {
      const docRef = doc(db, 'subscriptions', subscriptionId.value!)
      await setDoc(docRef, subscriptionForm.value, { merge: true })
    } else {
      await addDoc(collection(db, 'subscriptions'), subscriptionForm.value)
    }
    
    await navigateTo(localePath('/admin/subscriptions'))
  } catch (err: any) {
    saveError.value = err.message || t('admin.subscriptions.errorSaving')
    console.error('Error saving subscription:', err)
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
    loadSubscription()
  }
})

// Meta
useHead({
  title: computed(() => isEditing.value ? t('admin.subscriptions.editTitle') : t('admin.subscriptions.createTitle')),
  meta: [
    { name: 'description', content: computed(() => isEditing.value ? t('admin.subscriptions.editSubtitle') : t('admin.subscriptions.createSubtitle')) }
  ]
})
</script> 