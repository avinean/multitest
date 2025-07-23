<template>
  <div v-html="section.content"/>
</template>

<script setup lang="ts">
defineProps<{
  section: RichText;
}>();
</script>