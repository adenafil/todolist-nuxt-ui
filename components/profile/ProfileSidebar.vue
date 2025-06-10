<script setup lang="ts">
import { useAvatarUpload } from '~/composables/profile/useAvatarUpload'


const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:active-tab'])

const { isAvatarModalOpen, avatarPreview, uploadAvatar, handleAvatarChange } = useAvatarUpload()

const tabs = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: 'i-heroicons-user'
  },
  {
    id: 'password',
    label: 'Password',
    icon: 'i-heroicons-lock-closed'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'i-heroicons-bell'
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'i-heroicons-shield-check'
  }
]

const setActiveTab = (tabId: string) => {
  emit('update:active-tab', tabId)
}

</script>

<template>
  <div class="md:col-span-1">
    <UCard class="mb-6">
      <div class="flex flex-col items-center">
        <div class="relative mb-4">
          <UAvatar :src="user.avatar" :alt="user.name" size="2xl" />

          <UButton class=" absolute inset-0 flex items-center justify-center bg-gray-900/40 text-white rounded-full"
            color="neutral" variant="ghost">
            <UIcon name="i-heroicons-camera" class="text-lg" />
          </UButton>


          <!-- Improved Avatar Upload Modal, similar to Add Task Modal -->
          <UModal v-model:open="isAvatarModalOpen" title="Profile picture" description="Choose a new profile picture">
            <UButton
              class="absolute inset-0 flex items-center justify-center bg-gray-900/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              label="Open" color="neutral" variant="subtle">
              <UIcon name="i-heroicons-camera" class="text-lg" />

            </UButton>


            <template #body>
              <div class="space-y-6">
                <div class="flex justify-center">
                  <UAvatar :src="avatarPreview" :alt="user.name" size="2xl" />
                </div>

                <div>
                  <input type="file" id="avatar-upload" accept="image/*" @change="handleAvatarChange" class="hidden" />
                  <label for="avatar-upload"
                    class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <UIcon name="i-heroicons-photo" class="mr-2" />
                    Choose a Photo
                  </label>
                </div>
              </div>

              <div class="flex justify-end gap-2 mt-10">
                <UButton @click="isAvatarModalOpen = false" color="secondary" variant="soft" size="lg">
                  Cancel
                </UButton>
                <UButton @click="uploadAvatar" color="primary" size="lg">
                  Upload
                </UButton>
              </div>

            </template>
          </UModal>
        </div>

        <h3 class="text-lg font-medium">{{ user.name }}</h3>
        <p class="text-gray-500 text-sm">{{ user.email }}</p>
        <div class="text-xs text-gray-500 mt-2 flex items-center">
          <UIcon name="i-heroicons-calendar" class="mr-1" />
          Member since {{ new Date(user.created_at).toLocaleDateString() }}
        </div>
      </div>
    </UCard>

    <!-- Navigation Menu -->
    <UCard>
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <button @click="setActiveTab('personal')"
          class="w-full text-left py-3 px-2 flex items-center rounded-t transition-colors"
          :class="activeTab === 'personal' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'">
          <UIcon name="i-heroicons-user" class="mr-2" />
          Personal Information
        </button>
        <button @click="setActiveTab('password')" class="w-full text-left py-3 px-2 flex items-center transition-colors"
          :class="activeTab === 'password' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'">
          <UIcon name="i-heroicons-key" class="mr-2" />
          Change Password
        </button>
        <button @click="setActiveTab('security')"
          class="w-full text-left py-3 px-2 flex items-center rounded-b transition-colors"
          :class="activeTab === 'security' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'">
          <UIcon name="i-heroicons-shield-check" class="mr-2" />
          Security
        </button>

        <button @click="setActiveTab('notifications')"
          class="w-full text-left py-3 px-2 flex items-center rounded-b transition-colors"
          :class="activeTab === 'notifications' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'">
          <UIcon name="i-heroicons-bell" class="mr-2" />
          Notifications
        </button>

      </div>
    </UCard>
  </div>
</template>