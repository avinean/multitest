<template>
  <UseBlogPost />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin-auth'
})
</script>