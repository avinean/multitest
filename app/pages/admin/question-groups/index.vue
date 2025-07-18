<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ $t('admin.questionGroups.title') }}</h2>
          <p class="text-gray-600 mt-1">{{ $t('admin.questionGroups.subtitle') }}</p>
        </div>
        <div>
          <UButton :to="$localePath('/admin/question-groups/new')" size="lg">
            {{ $t('admin.questionGroups.create') }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <UInput 
            v-model="searchQuery"
            :placeholder="$t('admin.questionGroups.search')"
            icon="i-heroicons-magnifying-glass"
            size="md"
          />
          <USelect 
            v-model="selectedType"
            :items="questionGroupTypes"
            :placeholder="$t('admin.questionGroups.filterByType')"
            size="md"
          />
          <USelect 
            v-model="selectedStatus"
            :items="statusOptions"
            :placeholder="$t('admin.questionGroups.filterByStatus')"
            size="md"
          />
          <UButton 
            v-if="hasActiveFilters"
            variant="ghost" 
            color="error"
            size="md"
            @click="clearFilters"
          >
            {{ $t('admin.questionGroups.clearFilters') }}
          </UButton>
      </div>
      
      <!-- Results count -->
      <div v-if="!questionGroupsLoading && questionGroups" class="mt-3 text-sm text-gray-600">
        {{ $t('admin.questionGroups.showing') }} {{ filteredQuestionGroups.length }} {{ $t('admin.questionGroups.of') }} {{ questionGroups.length }} question groups
        <span v-if="hasActiveFilters" class="font-medium">{{ $t('admin.questionGroups.filtered') }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="questionGroupsLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-3"/>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"/>
        <div class="h-4 bg-gray-200 rounded w-1/4"/>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="questionGroupsError" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex">
        <div class="text-red-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ $t('admin.questionGroups.errorLoading') }}</h3>
          <p class="mt-1 text-sm text-red-700">{{ questionGroupsError }}</p>
        </div>
      </div>
    </div>

    <!-- Question Groups List -->
    <div v-else-if="filteredQuestionGroups.length > 0" class="space-y-4">
      <div 
        v-for="group in filteredQuestionGroups" 
        :key="group.id"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ group.name || $t('admin.questionGroups.untitledGroup') }}</h3>
              <UBadge 
                color="primary"
                variant="outline"
                size="sm"
              >
                {{ group.type }}
              </UBadge>
              <UBadge 
                :color="group.archived ? 'neutral' : (group.published ? 'success' : 'neutral')"
                :variant="group.archived ? 'solid' : (group.published ? 'solid' : 'outline')"
                size="sm"
              >
                {{ group.archived ? $t('admin.questionGroups.archived') : (group.published ? $t('admin.questionGroups.published') : $t('admin.questionGroups.draft')) }}
              </UBadge>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>ID: {{ group.id }}</span>
              <span>{{ group.questions?.length || 0 }} {{ $t('admin.questionGroups.subQuestions') }}</span>
              <span v-if="group.createdAt">{{ $t('admin.questionGroups.created') }}: {{ new Date(group.createdAt?.toDate?.() || group.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <UButton 
              :to="`/admin/question-groups/${group.id}`"
              size="sm" 
              variant="outline"
            >
              {{ $t('admin.questionGroups.edit') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <!-- No groups at all -->
      <template v-if="!questionGroups || questionGroups.length === 0">
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('admin.questionGroups.noGroupsFound') }}</h3>
        <p class="text-gray-500 mb-6">{{ $t('admin.questionGroups.noGroupsMessage') }}</p>
        <UButton :to="$localePath('/admin/question-groups/new')">
          {{ $t('admin.questionGroups.createFirst') }}
        </UButton>
      </template>
      <!-- No filtered results -->
      <template v-else>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('admin.questionGroups.noMatchingFilters') }}</h3>
        <p class="text-gray-500 mb-6">{{ $t('admin.questionGroups.adjustFilters') }}</p>
        <UButton variant="outline" @click="clearFilters">
          {{ $t('admin.questionGroups.clearFilters') }}
        </UButton>
      </template>
    </div>
  </div>
</template>

<script setup>
import { collection } from 'firebase/firestore'
import { useCollection, useFirestore } from 'vuefire'

definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})


const db = useFirestore()

const { data: questionGroups, pending: questionGroupsLoading, error: questionGroupsError } = useCollection(
  collection(db, 'question-groups')
)

// Filter state
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const statusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' }
]

// Computed properties
const filteredQuestionGroups = computed(() => {
  if (!questionGroups.value) return []
  
  return questionGroups.value.filter(group => {
    // Search by name
    const matchesSearch = !searchQuery.value || 
      (group.name || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filter by type
    const matchesType = !selectedType.value || group.type === selectedType.value
    
    // Filter by status - exclude archived by default unless specifically requested
    let matchesStatus = true
    if (selectedStatus.value) {
      matchesStatus = (selectedStatus.value === 'published' && group.published && !group.archived) ||
                     (selectedStatus.value === 'draft' && !group.published && !group.archived) ||
                     (selectedStatus.value === 'archived' && group.archived)
    } else {
      // Default behavior: exclude archived items
      matchesStatus = !group.archived
    }
    
    return matchesSearch && matchesType && matchesStatus
  })
})

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedType.value || selectedStatus.value)
})

// Filter functions
const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
}
</script> 