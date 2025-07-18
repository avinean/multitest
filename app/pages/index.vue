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
  </div>
 </template>

<script setup>
const { t } = useI18n()

useHead({
  title: computed(() => `${t('home.title')} - Home`)
})

const localePath = useLocalePath()

const handleStartTest = () => {
  // Navigate directly to test page
  navigateTo(localePath('/test'))
}


</script> 