<template>
  <UContainer class="py-4">
    <!-- Hide tabs on small screens -->
    <div class="hidden md:block mb-4">
      <UTabs
        :model-value="$route.path"
        :items="items"
        class="w-full"
        @update:model-value="handleTabChange"
      />
    </div>
    
    <!-- Mobile navigation - show on small screens -->
    <div class="md:hidden mb-4">
      <USelect
        :model-value="$route.path"
        :items
        class="w-full"
        @update:model-value="handleSelectChange"
      />
    </div>
    
    <NuxtPage />
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const localePath = useLocalePath()
const { t } = useI18n()
const router = useRouter()

const items = computed(() => [
  {
    label: t('profile.nav.dashboard'),
    icon: 'i-lucide-user',
    value: localePath('/profile')
  },
  {
    label: t('profile.nav.settings'),
    icon: 'i-lucide-settings',
    value: localePath('/profile/settings')
  },
  {
    label: t('profile.nav.tests'),
    icon: 'i-lucide-lock',
    value: localePath('/profile/tests')
  },
  {
    label: t('profile.nav.subscriptions'),
    icon: 'i-lucide-credit-card',
    value: localePath('/profile/subscriptions')
  },
  {
    label: t('profile.nav.payments'),
    icon: 'i-lucide-receipt',
    value: localePath('/profile/payments')
  }
])

const handleTabChange = (value: string | number) => {
  if (value && typeof value === 'string') {
    router.push(value)
  }
}

const handleSelectChange = (value: any) => {
  if (value && typeof value === 'string') {
    router.push(value)
  }
}
</script> 