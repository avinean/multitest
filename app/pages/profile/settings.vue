<template>
  <UContainer>
    <!-- Profile Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div class="flex items-center space-x-4 mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 rounded-full flex items-center justify-center">
          <UIcon name="i-heroicons-user" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ user?.email }}</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ $t('profile.memberSince') }} <NuxtTime v-if="user?.metadata?.creationTime" :datetime="user.metadata.creationTime" month="long" day="numeric" year="numeric" /></p>
        </div>
      </div>

      <!-- Profile Info -->
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('profile.email') }}</label>
            <p class="text-gray-900 dark:text-white">{{ user?.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('profile.emailVerified') }}</label>
            <div class="flex items-center">
              <UIcon 
                :name="user?.emailVerified ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
                :class="user?.emailVerified ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
                class="w-5 h-5 mr-2"
              />
              <span :class="user?.emailVerified ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                {{ user?.emailVerified ? $t('profile.verified') : $t('profile.notVerified') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Admin Status -->
        <div v-if="profile" class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('profile.roles') }}</label>
          <div class="flex flex-wrap gap-2">
            <UBadge 
              v-for="role in profile.roles" 
              :key="role"
              :color="role === 'admin' ? 'primary' : 'neutral'"
              variant="solid"
            >
              {{ role }}
            </UBadge>
            <span v-if="!profile.roles || profile.roles.length === 0" class="text-gray-500 dark:text-gray-400">
              {{ $t('profile.noRoles') }}
            </span>
          </div>
        </div>

        <!-- Last Sign In -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('profile.lastSignIn') }}</label>
          <p class="text-gray-900 dark:text-white">
            <NuxtTime v-if="user?.metadata?.lastSignInTime" :datetime="user.metadata.lastSignInTime" month="long" day="numeric" year="numeric" hour="numeric" minute="numeric" />
            <span v-else>-</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('profile.actions') }}</h3>
      
      <div class="space-y-3">
        <UButton 
          variant="outline" 
          color="error"
          @click="handleSignOut"
          class="w-full justify-start border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
        >
          <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 mr-3" />
          {{ $t('nav.signOut') }}
        </UButton>
      </div>
    </div>

    <!-- Admin Section -->
    <div v-if="isAdmin" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('profile.adminSection') }}</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">{{ $t('profile.adminDescription') }}</p>
      
      <div class="space-y-3">
        <UButton 
          :to="$localePath('/admin')"
          color="primary"
          class="w-full justify-start"
        >
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 mr-3" />
          {{ $t('profile.goToAdmin') }}
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { user, profile, isAdmin, signOut } = await useAuth()
const localePath = useLocalePath()

const handleSignOut = async () => {
  try {
    await signOut()
    await navigateTo(localePath('/'))
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script> 