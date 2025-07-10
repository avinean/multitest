<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center">
    <UContainer class="text-center">
      <h1 class="text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
        {{ $t('home.title') }}
      </h1>
      <p class="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
        {{ $t('home.subtitle') }}
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <UCard class="bg-white/10 backdrop-blur-md border border-white/20">
          <template #header>
            <div class="text-center">
              <div class="text-5xl mb-4">📖</div>
              <h3 class="text-xl font-semibold">{{ $t('home.features.reading.title') }}</h3>
            </div>
          </template>
          <p class="text-center">{{ $t('home.features.reading.description') }}</p>
        </UCard>
        
        <UCard class="bg-white/10 backdrop-blur-md border border-white/20">
          <template #header>
            <div class="text-center">
              <div class="text-5xl mb-4">✏️</div>
              <h3 class="text-xl font-semibold">{{ $t('home.features.grammar.title') }}</h3>
            </div>
          </template>
          <p class="text-center">{{ $t('home.features.grammar.description') }}</p>
        </UCard>
        
        <UCard class="bg-white/10 backdrop-blur-md border border-white/20">
          <template #header>
            <div class="text-center">
              <div class="text-5xl mb-4">🧩</div>
              <h3 class="text-xl font-semibold">{{ $t('home.features.cloze.title') }}</h3>
            </div>
          </template>
          <p class="text-center">{{ $t('home.features.cloze.description') }}</p>
        </UCard>
      </div>

      <div class="space-y-6">
        <UButton 
          size="xl" 
          class="px-12 py-4 text-lg font-semibold"
          color="primary"
          @click="handleStartTest"
        >
          {{ $t('home.startTest') }}
        </UButton>

        <p class="text-sm">
          {{ $t('home.testInfo') }}
        </p>
      </div>
    </UContainer>
    
    <!-- Email Modal -->
    <UModal 
      v-model:open="showEmailModal" 
      :title="$t('home.emailModal.title')"
    >
      <template #body>
        <UForm 
          class="space-y-4" 
          :state="emailForm" 
          :validate-on="[]"
          @submit="startTest"
        >
          <UInput 
            v-model="emailForm.email"
            type="email"
            :placeholder="$t('home.emailModal.emailPlaceholder')"
            :disabled="submitting"
            required
            icon="i-heroicons-envelope"
            class="w-full"
          />

          <UInput 
            v-model="emailForm.name"
            :placeholder="$t('home.emailModal.namePlaceholder')"
            :disabled="submitting"
            icon="i-heroicons-user"
            class="w-full"
          />
        </UForm>
      </template>

      <template #footer>
        <div class="w-full flex justify-end">
          <UButton 
            :loading="submitting"
            :disabled="!isEmailValid"
            @click="startTest"
          >
            {{ $t('home.emailModal.startTest') }}
          </UButton>
        </div>
       </template>
     </UModal>
   </div>
 </template>

<script setup>
const { t } = useI18n()

useHead({
  title: computed(() => `${t('home.title')} - Home`)
})

const showEmailModal = ref(false)
const submitting = ref(false)

const emailForm = ref({
  email: '',
  name: ''
})

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailForm.value.email)
})

const localePath = useLocalePath()

const handleStartTest = () => {
  // Check if user info already exists
  const existingUserInfo = sessionStorage.getItem('userInfo')
  
  if (existingUserInfo) {
    // User info exists, go directly to test
    navigateTo(localePath('/test'))
  } else {
    // No user info, show email modal
    showEmailModal.value = true
  }
}

const startTest = async () => {
  if (!isEmailValid.value) return
  
  submitting.value = true
  
  try {    
    sessionStorage.setItem('userInfo', JSON.stringify({
      ...emailForm.value,
      startTime: new Date().toISOString()
    }))
    
    // Navigate to test page
    await navigateTo(localePath('/test'))
  } catch (error) {
    console.error('Error starting test:', error)
  } finally {
    submitting.value = false
  }
}


</script> 