<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ $t('admin.users.title') }}</h2>
          <p class="text-gray-600 mt-1">{{ $t('admin.users.subtitle') }}</p>
          <p class="text-sm text-amber-600 mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1" />
            {{ $t('admin.users.limitation') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full"/>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"/>
            <div class="h-3 bg-gray-200 rounded w-1/2"/>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-red-400 mr-3" />
        <div>
          <h3 class="text-lg font-medium text-red-800">{{ $t('admin.users.errorLoading') }}</h3>
          <p class="text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Users List -->
    <div v-else-if="data && data.length > 0" class="space-y-4">
      <div 
        v-for="user in data" 
        :key="user.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- User Avatar -->
            <div v-if="user.photoURL" class="w-12 h-12 rounded-full overflow-hidden">
              <img :src="user.photoURL" :alt="user.displayName" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <UIcon name="i-heroicons-user" class="w-6 h-6 text-white" />
            </div>
            
            <!-- User Info -->
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ user.displayName }}</h3>
                <UBadge 
                  v-if="user.roles && user.roles.includes('admin')"
                  color="error"
                  variant="soft"
                  size="sm"
                >
                  {{ $t('admin.users.admin') }}
                </UBadge>
                <UBadge 
                  v-if="user.emailVerified"
                  color="success"
                  variant="soft"
                  size="sm"
                >
                  {{ $t('admin.users.verified') }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                {{ user.email }}
              </p>
              <p class="text-sm text-gray-500">
                {{ $t('admin.users.userId') }}: {{ user.id }}
              </p>
              <div class="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                <span>{{ $t('admin.users.roles') }}: {{ user.roles ? user.roles.join(', ') : $t('admin.users.noRoles') }}</span>
                <span v-if="user.lastSignInTime">{{ $t('admin.users.lastSignIn') }}: {{ new Date(user.lastSignInTime).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <UButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-eye"
              :title="$t('admin.users.viewDetails')"
              @click="selectedUser = user"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="data && data.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <UIcon name="i-heroicons-users" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('admin.users.noUsersFound') }}</h3>
      <p class="text-gray-600">{{ $t('admin.users.noUsersMessage') }}</p>
    </div>
  </div>

  <!-- User Details Modal -->
  <UModal v-model:open="selectedUser" size="2xl">
    <template #header>
      <div class="flex items-center space-x-3">
        <div v-if="selectedUser?.photoURL" class="w-12 h-12 rounded-full overflow-hidden">
          <img :src="selectedUser.photoURL" :alt="selectedUser.displayName" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-user" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ selectedUser?.displayName }}</h3>
          <p class="text-sm text-gray-500">{{ selectedUser?.email }}</p>
        </div>
      </div>
    </template>

    <template #body>
      <div v-if="selectedUser" class="space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('admin.users.basicInfo') }}</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">{{ $t('admin.users.displayName') }}:</span>
                <span class="text-sm font-medium">{{ selectedUser.displayName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">{{ $t('admin.users.email') }}:</span>
                <span class="text-sm font-medium">{{ selectedUser.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">{{ $t('admin.users.userId') }}:</span>
                <span class="text-sm font-medium font-mono">{{ selectedUser.id }}</span>
              </div>
              <div v-if="selectedUser.photoURL" class="flex justify-between">
                <span class="text-sm text-gray-500">{{ $t('admin.users.avatar') }}:</span>
                <span class="text-sm font-medium text-blue-600 hover:text-blue-800">
                  <a :href="selectedUser.photoURL" target="_blank" rel="noopener noreferrer">
                    {{ $t('admin.users.viewAvatar') }}
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('admin.users.status') }}</h4>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">{{ $t('admin.users.emailVerified') }}:</span>
                <UBadge 
                  :color="selectedUser.emailVerified ? 'success' : 'warning'"
                  variant="soft"
                  size="sm"
                >
                  {{ selectedUser.emailVerified ? $t('admin.users.verified') : $t('admin.users.notVerified') }}
                </UBadge>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">{{ $t('admin.users.roles') }}:</span>
                <div class="flex gap-1">
                  <UBadge 
                    v-for="role in selectedUser.roles" 
                    :key="role"
                    :color="role === 'admin' ? 'error' : 'neutral'"
                    variant="soft"
                    size="sm"
                  >
                    {{ role }}
                  </UBadge>
                  <span v-if="!selectedUser.roles || selectedUser.roles.length === 0" class="text-sm text-gray-400">
                    {{ $t('admin.users.noRoles') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timestamps -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('admin.users.timestamps') }}</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-xs text-gray-500 mb-1">{{ $t('admin.users.created') }}</div>
              <div class="text-sm font-medium">
                <NuxtTime v-if="selectedUser.createdAt" :datetime="new Date(selectedUser.createdAt.toDate())" month="long" day="numeric" year="numeric" hour="numeric" minute="numeric" />
                <span v-else class="text-gray-400">-</span>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-xs text-gray-500 mb-1">{{ $t('admin.users.lastSignIn') }}</div>
              <div class="text-sm font-medium">
                <NuxtTime v-if="selectedUser.lastSignInTime" :datetime="new Date(selectedUser.lastSignInTime)" month="long" day="numeric" year="numeric" hour="numeric" minute="numeric" />
                <span v-else class="text-gray-400">-</span>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-xs text-gray-500 mb-1">{{ $t('admin.users.lastUpdated') }}</div>
              <div class="text-sm font-medium">
                <NuxtTime v-if="selectedUser.updatedAt" :datetime="new Date(selectedUser.updatedAt.toDate())" month="long" day="numeric" year="numeric" hour="numeric" minute="numeric" />
                <span v-else class="text-gray-400">-</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Data -->
        <div v-if="selectedUser.profile">
          <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('admin.users.profileData') }}</h4>
          <div class="bg-gray-50 rounded-lg p-3">
            <pre class="text-xs text-gray-600 overflow-auto">{{ JSON.stringify(selectedUser.profile, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <UButton
          variant="outline"
          @click="selectedUser = null"
        >
          {{ $t('common.close') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { collection, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ]
})

const selectedUser = ref<any>(null)
const db = useFirestore()

const { data, pending, error } = await useAsyncData('users', async () => {
  const snapshot = await getDocs(collection(db, 'profiles'))
  return snapshot.docs.map(doc =>  doc.data())
})
</script> 