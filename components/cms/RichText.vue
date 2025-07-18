<template>
  <div v-html="section.content"/>
</template>

<script setup lang="ts">
import type { RichText } from '~/types/cms';

defineProps<{
  section: RichText;
}>();
</script>