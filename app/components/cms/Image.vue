<template>
  <div>
    <img :src="section.imageUrl" :alt="section.alt" :title="section.title" :caption="section.caption" class="mx-auto">
  </div>
</template>

<script setup lang="ts">
defineProps<{
  section: Image;
}>();
</script>