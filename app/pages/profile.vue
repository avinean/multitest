<template>
  <UContainer class="py-4">
    <UTabs
      :model-value="$route.path"
      :items 
      class="w-full"
      @update:model-value="navigateTo($event)"
    />

    <NuxtPage />
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const localePath = useLocalePath()

const items = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-user',
    value: localePath('/profile')
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    value: localePath('/profile/settings')
  },
  {
    label: 'Tests',
    icon: 'i-lucide-lock',
    value: localePath('/profile/tests')
  }
]

</script> 