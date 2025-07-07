<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-xl font-bold">
              English Test
            </NuxtLink>
          </div>
          
          <nav class="flex items-center space-x-4">
            <UButton 
              to="/" 
              variant="ghost" 
              size="sm"
            >
              Home
            </UButton>
            <UButton 
              to="/test" 
              variant="ghost" 
              size="sm"
            >
              Take Test
            </UButton>
            <UButton 
              to="/admin/login" 
              variant="ghost" 
              size="sm"
            >
              Admin
            </UButton>
          </nav>
        </div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
      <UContainer>
        <div class="py-8 text-center">
          <p class="text-sm">
            &copy; {{ new Date().getFullYear() }} English Proficiency Test. All rights reserved.
          </p>
        </div>
      </UContainer>
    </footer>
  </div>
</template> 