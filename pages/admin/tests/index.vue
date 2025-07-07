<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Tests Management</h2>
          <p class="text-gray-600 mt-1">View and manage your tests</p>
        </div>
        <div>
          <UButton to="/admin/tests/new" size="lg">
            Create New Test
          </UButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="testsLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-3"/>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"/>
        <div class="h-4 bg-gray-200 rounded w-1/4"/>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="testsError" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex">
        <div class="text-red-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading tests</h3>
          <p class="mt-1 text-sm text-red-700">{{ testsError }}</p>
        </div>
      </div>
    </div>

    <!-- Tests List -->
    <div v-else-if="tests && tests.length > 0" class="space-y-4">
      <div 
        v-for="test in tests" 
        :key="test.id"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ test.name }}</h3>
              <UBadge 
                :color="test.published ? 'success' : 'neutral'"
                :variant="test.published ? 'solid' : 'outline'"
                size="sm"
              >
                {{ test.published ? 'Published' : 'Draft' }}
              </UBadge>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>ID: {{ test.id }}</span>
              <span>{{ test.questions?.length || 0 }} questions</span>
            </div>
            <div v-if="test.description" class="mt-2">
              <p class="text-sm text-gray-600">{{ test.description }}</p>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <UButton 
              :to="`/admin/tests/${test.id}`"
              size="sm" 
              variant="outline"
            >
              Edit
            </UButton>
          </div>
        </div>

        <!-- Test Preview -->
        <div v-if="test.questions && test.questions.length > 0" class="mt-4 pt-4 border-t border-gray-100">
          <p class="text-sm text-gray-600 mb-2">Sample questions:</p>
          <ul class="text-sm text-gray-500 space-y-1">
            <li v-for="(question, index) in test.questions.slice(0, 3)" :key="index">
              {{ index + 1 }}. {{ question.text.length > 80 ? question.text.substring(0, 80) + '...' : question.text }}
            </li>
            <li v-if="test.questions.length > 3" class="font-medium">
              +{{ test.questions.length - 3 }} more questions
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
      <p class="text-gray-500 mb-6">No tests are currently available in the database</p>
      <UButton to="/admin/tests/new">
        Create Your First Test
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { collection } from 'firebase/firestore'
import { useCollection } from 'vuefire'

definePageMeta({
  title: 'Admin - Test Management',
  layout: 'admin'
})

const db = inject('db')

// Fetch tests data directly using useCollection
const { data: tests, pending: testsLoading, error: testsError } = useCollection(
  collection(db, 'tests')
)
</script> 