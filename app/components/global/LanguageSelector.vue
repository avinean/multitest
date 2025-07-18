<template>
  <UDropdownMenu :items="languageMenuItems" :popper="{ placement: 'bottom-end' }">
    <UButton 
      variant="ghost" 
      size="sm"
      icon="i-heroicons-language"
      class="flex items-center gap-2"
    >
      {{ currentLocale.name }}
      <UIcon name="i-heroicons-chevron-down-20-solid" class="w-3 h-3" />
    </UButton>
  </UDropdownMenu>
</template>

<script setup>
const { locale, locales, setLocale } = useI18n()


const currentLocale = computed(() =>
  locales.value.find(l => l.code === locale.value) || locales.value[0]
)

const languageMenuItems = computed(() => [
  locales.value.map(localeItem => ({
    label: localeItem.name,
    onSelect: () => setLocale(localeItem.code)
  }))
])
</script> 