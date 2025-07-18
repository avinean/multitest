<template>
  <div class="space-y-4">
    <!-- Add Section -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">{{ $t('admin.blog.contentSections') }}</h3>
      <div class="flex gap-2">
        <UButton
          type="button"
          size="sm"
          variant="outline"
          :disabled
          @click="addSection('rich-text')"
        >
          {{ $t('admin.blog.richText') }}
        </UButton>
        <UButton
          type="button"
          size="sm"
          variant="outline"
          :disabled
          @click="addSection('image')"
        >
          {{ $t('admin.blog.image') }}
        </UButton>
        <UButton
          type="button"
          size="sm"
          variant="outline"
          :disabled
          @click="addSection('grid')"
        >
          Grid Layout
        </UButton>
        <UButton
          type="button"
          size="sm"
          variant="outline"
          :disabled
          @click="addSection('question-group')"
        >
          Question Group
        </UButton>
      </div>
    </div>

    <!-- Sections List -->
    <div v-if="sections && sections.length > 0" class="space-y-4">
      <div 
        v-for="(section, index) in sections" 
        :key="section.id"
        class="border border-gray-200 rounded-lg p-4 bg-gray-50"
      >
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-700">
              {{ getSectionTypeLabel(section.type) }}
            </span>
            <span class="text-xs text-gray-500">#{{ index + 1 }}</span>
          </div>
          <div class="flex items-center gap-1">
            <UButton
              type="button"
              size="xs"
              variant="ghost"
              :disabled="disabled || index === 0"
              @click="moveSection(index, 'up')"
            >
              <UIcon name="i-heroicons-arrow-up" class="w-4 h-4" />
            </UButton>
            <UButton
              type="button"
              size="xs"
              variant="ghost"
              :disabled="disabled || index === sections.length - 1"
              @click="moveSection(index, 'down')"
            >
              <UIcon name="i-heroicons-arrow-down" class="w-4 h-4" />
            </UButton>
            <UButton
              type="button"
              size="xs"
              variant="ghost"
              color="error"
              :disabled
              @click="deleteSection(index)"
            >
              <UIcon name="i-heroicons-trash" class="w-4 h-4" />
            </UButton>
          </div>
        </div>

        <AdminRichText 
          v-if="section.type === 'rich-text'"
          v-model="section.content" 
          :placeholder="$t('admin.blog.richTextHint')"
          :disabled
        />
        <AdminImage
          v-if="section.type === 'image'"
          v-model="sections[index]"
          :disabled
        />
        <AdminGrid
          v-if="section.type === 'grid'"
          v-model="sections[index]"
          :disabled
        />
        <AdminQuestionGroup
          v-if="section.type === 'question-group'"
          v-model="sections[index]"
          :disabled
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
      <div class="text-gray-400 mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <p class="text-gray-500">{{ $t('admin.blog.noSections') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Section } from '~/types/cms'

interface Props {
  disabled?: boolean
}

const { disabled } = defineProps<Props>()

// Use defineModel for two-way binding
const sections = defineModel<Section[]>('modelValue', { required: true })

// Section types configuration
const sectionTypes = [
  { value: 'rich-text', label: 'Rich Text' },
  { value: 'image', label: 'Image' },
  { value: 'grid', label: 'Grid Layout' },
  { value: 'question-group', label: 'Question Group' }
]

// Helper Functions
const generateSectionId = () => {
  return `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const getSectionTypeLabel = (type: string) => {
  const sectionType = sectionTypes.find(st => st.value === type)
  return sectionType ? sectionType.label : type
}

// Section Management Functions
const addSection = (sectionType: string) => {
  let newSection: Section

  // Add type-specific properties
  if (sectionType === 'rich-text') {
    newSection = {
      id: generateSectionId(),
      type: 'rich-text',
      content: ''
    }
  } else if (sectionType === 'image') {
    newSection = {
      id: generateSectionId(),
      type: 'image',
      imageUrl: '',
      alt: '',
      title: '',
      caption: ''
    }
  } else if (sectionType === 'grid') {
    newSection = {
      id: generateSectionId(),
      type: 'grid',
      columns: {
        sm: 1,
        md: 2,
        lg: 3
      },
      cells: []
    }
  } else if (sectionType === 'question-group') {
    newSection = {
      id: generateSectionId(),
      type: 'question-group',
      questionGroupId: '',
      title: '',
      description: ''
    }
  } else {
    throw new Error(`Unknown section type: ${sectionType}`)
  }

  sections.value.push(newSection)
}

const deleteSection = (index: number) => {
  if (confirm('Are you sure you want to delete this section?')) {
    sections.value.splice(index, 1)
  }
}

const moveSection = (index: number, direction: 'up' | 'down') => {
  const sectionsArray = sections.value
  if (direction === 'up' && index > 0) {
    [sectionsArray[index], sectionsArray[index - 1]] = [sectionsArray[index - 1], sectionsArray[index]]
  } else if (direction === 'down' && index < sectionsArray.length - 1) {
    [sectionsArray[index], sectionsArray[index + 1]] = [sectionsArray[index + 1], sectionsArray[index]]
  }
}
</script> 