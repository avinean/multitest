<template>
  <div class="space-y-4">
    <!-- Grid Configuration -->
    <div class="bg-white p-4 rounded-lg border border-gray-200">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Grid Configuration</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormField label="Small screens (sm)" hint="Columns for mobile devices">
          <USelect
            v-model="gridColumns.sm"
            :items="[1, 2, 3, 4, 6, 12]"
            :disabled
            class="w-full"
          />
        </UFormField>
        <UFormField label="Medium screens (md)" hint="Columns for tablets">
          <USelect
            v-model="gridColumns.md"
            :items="[1, 2, 3, 4, 6, 12]"
            :disabled
            class="w-full"
          />
        </UFormField>
        <UFormField label="Large screens (lg)" hint="Columns for desktop">
          <USelect
            v-model="gridColumns.lg"
            :items="[1, 2, 3, 4, 6, 12]"
            :disabled
            class="w-full"
          />
        </UFormField>
      </div>
    </div>

    <!-- Grid Cells -->
    <div class="bg-white p-4 rounded-lg border border-gray-200">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-medium text-gray-700">Grid Cells</h4>
        <UButton
          type="button"
          size="xs"
          variant="outline"
          :disabled
          @click="addGridCell"
        >
          Add Cell
        </UButton>
      </div>
      
      <div v-if="gridCells && gridCells.length > 0" class="space-y-3">
        <div 
          v-for="(cell, cellIndex) in gridCells" 
          :key="cell.id"
          class="border border-gray-200 rounded-lg p-3 bg-gray-50"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-500">Cell #{{ cellIndex + 1 }}</span>
            <UButton
              type="button"
              size="xs"
              variant="ghost"
              color="error"
              :disabled
              @click="removeGridCell(cellIndex)"
            >
              <UIcon name="i-heroicons-trash" class="w-3 h-3" />
            </UButton>
          </div>
          
          <!-- Cell Content -->
          <div class="space-y-3">
            <!-- Rich Text Cell -->
            <AdminRichText 
              v-if="cell.type === 'rich-text'"
              v-model="cell.content" 
              :disabled
            />
            
            <!-- Image Cell -->
            <div v-if="cell.type === 'image'">
              <AdminImage
                v-model="gridCells[cellIndex]"
                :disabled
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty Grid State -->
      <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
        <div class="text-gray-400 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
        </div>
        <p class="text-sm text-gray-500">{{ $t('admin.blog.noCells') }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ $t('admin.blog.noCellsMessage') }}</p>
      </div>
    </div>

    <!-- Cell Type Selection Modal -->
    <UModal 
      v-model:open="showCellTypeModal" 
      title="Select Cell Type"
      :ui="{ content: 'w-full max-w-md' }"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-gray-600">Choose the type of content for this grid cell:</p>
          
          <div class="grid grid-cols-1 gap-3">
            <UButton
              type="button"
              variant="outline"
              class="justify-start p-4 h-auto"
              @click="createGridCell('rich-text')"
            >
              <div class="flex items-center gap-3">
                <div class="text-blue-500">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-medium">Rich Text</div>
                  <div class="text-xs text-gray-500">Add formatted text content</div>
                </div>
              </div>
            </UButton>
            
            <UButton
              type="button"
              variant="outline"
              class="justify-start p-4 h-auto"
              @click="createGridCell('image')"
            >
              <div class="flex items-center gap-3">
                <div class="text-green-500">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <div class="font-medium">Image</div>
                  <div class="text-xs text-gray-500">Add an image with caption</div>
                </div>
              </div>
            </UButton>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end">
          <UButton 
            type="button" 
            color="neutral" 
            variant="outline"
            @click="showCellTypeModal = false"
          >
            Cancel
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Section } from '~/shared/types/cms'

interface Props {
  modelValue: Section
  disabled?: boolean
}

const { disabled } = defineProps<Props>()

// Use defineModel for two-way binding
const gridData = defineModel<Section>('modelValue', { required: true })

// Grid cell modal state
const showCellTypeModal = ref(false)

// Helper Functions
const generateCellId = () => {
  return `cell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Type guard to ensure we're working with a grid section
const isGridSection = (section: Section): section is Section & { type: 'grid'; columns: { sm: number; md: number; lg: number }; cells: Section[] } => {
  return section.type === 'grid'
}

// Computed properties with type guards
const gridColumns = computed(() => {
  if (isGridSection(gridData.value)) {
    return gridData.value.columns
  }
  return { sm: 1, md: 2, lg: 3 }
})

const gridCells = computed(() => {
  if (isGridSection(gridData.value)) {
    return gridData.value.cells
  }
  return []
})

// Grid Cell Functions
const addGridCell = () => {
  if (isGridSection(gridData.value)) {
    showCellTypeModal.value = true
  }
}

const createGridCell = (cellType: string) => {
  if (!isGridSection(gridData.value)) return
  
  let newCell: Section

  if (cellType === 'rich-text') {
    newCell = {
      id: generateCellId(),
      type: 'rich-text',
      content: ''
    }
  } else if (cellType === 'image') {
    newCell = {
      id: generateCellId(),
      type: 'image',
      imageUrl: '',
      alt: '',
      title: '',
      caption: ''
    }
  } else {
    throw new Error(`Unknown cell type: ${cellType}`)
  }
  
  gridData.value.cells.push(newCell)
  
  // Close modal
  showCellTypeModal.value = false
}

const removeGridCell = (cellIndex: number) => {
  if (!isGridSection(gridData.value)) return
  if (confirm('Are you sure you want to delete this cell?')) {
    gridData.value.cells.splice(cellIndex, 1)
  }
}
</script> 