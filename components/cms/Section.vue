<template>
  <template v-if="section.type === 'text'">
    <!-- cms text -->
    {{ section.text }}
  </template>
  <template v-else-if="section.type === 'paragraph'">
    <!-- cms paragraph -->
    <p>
      <CmsSection v-for="child in section.children" :section="child" />
    </p>
  </template>
</template>

<script setup lang="ts">
import type { Section } from '~/types/cms';

const props = defineProps<{
  section: Section;
}>();
</script>