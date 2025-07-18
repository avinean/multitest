<template>
  <div>
    <img :src="section.imageUrl" :alt="section.alt" :title="section.title" :caption="section.caption" class="mx-auto">
  </div>
</template>

<script setup lang="ts">
import type { Image } from '@/types/cms';

defineProps<{
  section: Image;
}>();
</script>