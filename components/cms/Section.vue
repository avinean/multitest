<template>
  <template v-if="section.type === 'rich-text'">
    <!-- cms rich text -->
    <CmsRichText :section />
  </template>
  <template v-else-if="section.type === 'image'">
    <!-- cms image -->
    <CmsImage :section />
  </template>
  <template v-else-if="section.type === 'grid'">
    <!-- cms grid -->
    <CmsGrid :section />
  </template>
  <template v-else-if="section.type === 'question-group'">
    <!-- cms question group -->
    <CmsQuestionGroup :section />
  </template>
  <template v-else>
    <pre>{{ section }}</pre>
  </template>
</template>

<script setup lang="ts">
import type { Section } from '~/types/cms';

defineProps<{
  section: Section;
}>();
</script>