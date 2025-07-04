<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center">
    <UContainer class="text-center">
      <h1 class="text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
        English Proficiency Test
      </h1>
      <p class="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
        Test your English skills with our comprehensive assessment featuring reading comprehension, 
        grammar, and vocabulary exercises.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <UCard class="bg-white/10 backdrop-blur-md border border-white/20">
          <template #header>
            <div class="text-center">
              <div class="text-5xl mb-4">📖</div>
              <h3 class="text-xl font-semibold">Reading Comprehension</h3>
            </div>
          </template>
          <p class="text-center">Test your understanding of written English texts</p>
        </UCard>
        
        <UCard class="bg-white/10 backdrop-blur-md border border-white/20">
          <template #header>
            <div class="text-center">
              <div class="text-5xl mb-4">✏️</div>
              <h3 class="text-xl font-semibold">Grammar & Vocabulary</h3>
            </div>
          </template>
          <p class="text-center">Assess your knowledge of English grammar rules</p>
        </UCard>
        
        <UCard class="bg-white/10 backdrop-blur-md border border-white/20">
          <template #header>
            <div class="text-center">
              <div class="text-5xl mb-4">🧩</div>
              <h3 class="text-xl font-semibold">Cloze Tests</h3>
            </div>
          </template>
          <p class="text-center">Fill in the blanks to complete passages</p>
        </UCard>
      </div>

      <div class="space-y-6">
        <UButton 
          to="/test" 
          size="xl" 
          class="px-12 py-4 text-lg font-semibold"
          color="primary"
        >
          Start Test
        </UButton>
        <p class="text-sm">
          The test contains multiple question types and takes approximately 30-45 minutes to complete.
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
useHead({
  title: 'English Proficiency Test - Home'
})
</script> 