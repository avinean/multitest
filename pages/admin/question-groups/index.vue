<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Question Groups Management</h2>
          <p class="text-gray-600 mt-1">View and manage your question groups</p>
        </div>
        <div>
          <UButton to="/admin/question-groups/new" size="lg">
            Create New Question Group
          </UButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <UInput 
            v-model="searchQuery"
            placeholder="Search question groups by name..."
            icon="i-heroicons-magnifying-glass"
            size="md"
          />
          <USelect 
            v-model="selectedType"
            :items="questionGroupTypes"
            placeholder="Filter by type"
            size="md"
          />
          <USelect 
            v-model="selectedStatus"
            :items="statusOptions"
            placeholder="Filter by status"
            size="md"
          />
          <UButton 
            v-if="hasActiveFilters"
            variant="ghost" 
            color="error"
            size="md"
            @click="clearFilters"
          >
            Clear Filters
          </UButton>
      </div>
      
      <!-- Results count -->
      <div v-if="!questionGroupsLoading && questionGroups" class="mt-3 text-sm text-gray-600">
        Showing {{ filteredQuestionGroups.length }} of {{ questionGroups.length }} question groups
        <span v-if="hasActiveFilters" class="font-medium">(filtered)</span>
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
          <h3 class="text-sm font-medium text-red-800">Error loading question groups</h3>
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
              <h3 class="text-lg font-semibold text-gray-900">{{ group.name || 'Untitled Group' }}</h3>
              <UBadge 
                color="primary"
                variant="outline"
                size="sm"
              >
                {{ group.type }}
              </UBadge>
              <UBadge 
                :color="group.published ? 'success' : 'neutral'"
                :variant="group.published ? 'solid' : 'outline'"
                size="sm"
              >
                {{ group.published ? 'Published' : 'Draft' }}
              </UBadge>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>ID: {{ group.id }}</span>
              <span>{{ group.questions?.length || 0 }} sub-questions</span>
              <span v-if="group.createdAt">Created: {{ new Date(group.createdAt?.toDate?.() || group.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <UButton 
              :to="`/admin/question-groups/${group.id}`"
              size="sm" 
              variant="outline"
            >
              Edit
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
        <h3 class="text-lg font-medium text-gray-900 mb-2">No question groups found</h3>
        <p class="text-gray-500 mb-6">Create your first question group and start building your test content</p>
        <UButton to="/admin/question-groups/new">
          Create Your First Question Group
        </UButton>
      </template>
      <!-- No filtered results -->
      <template v-else>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No question groups match your filters</h3>
        <p class="text-gray-500 mb-6">Try adjusting your search criteria or clear the filters to see all groups</p>
        <UButton variant="outline" @click="clearFilters">
          Clear Filters
        </UButton>
      </template>
    </div>
  </div>
</template>

<script setup>
import { collection } from 'firebase/firestore'
import { useCollection } from 'vuefire'

definePageMeta({
  title: 'Admin - Question Groups Management',
  layout: 'admin'
})

const db = inject('db')

const { data: questionGroups, pending: questionGroupsLoading, error: questionGroupsError } = useCollection(
  collection(db, 'question-groups')
)

// Filter state
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const statusOptions = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' }
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
    
    // Filter by status
    const matchesStatus = !selectedStatus.value || 
      (selectedStatus.value === 'published' && group.published) ||
      (selectedStatus.value === 'draft' && !group.published)
    
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