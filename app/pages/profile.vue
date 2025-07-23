<template>
  <UContainer class="py-4">
    <UTabs
      :model-value="$route.path"
      :items 
      class="w-full"
      @update:model-value="navigateTo($localePath($event))"
    />

    <NuxtPage />
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const items = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-user',
    value: '/profile'
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    value: '/profile/settings'
  },
  {
    label: 'Tests',
    icon: 'i-lucide-lock',
    value: '/profile/tests'
  }
]

</script> 