<template>
  <div
    class="grid gap-4"
    :class="`sm:grid-cols-${section.columns.sm} md:grid-cols-${section.columns.md} lg:grid-cols-${section.columns.lg}`"
  >
    <div v-for="cell in section.cells" :key="cell.id">
      <CmsSection :section="cell" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Grid } from '~/shared/types/cms';

defineProps<{
  section: Grid;
}>();

/**
 * sm:grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 sm:grid-cols-6 sm:grid-cols-12
 * md:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-4 md:grid-cols-6 md:grid-cols-12
 * lg:grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 lg:grid-cols-6 lg:grid-cols-12
 */
</script>