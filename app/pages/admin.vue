<template>
  <main>
    <NuxtPage />
  </main>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'admin',
  redirect: '/admin/question-groups'
})
</script>