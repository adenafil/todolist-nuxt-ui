<script setup lang="ts">
import { useSearchState } from '~/composables/useSearchState'

definePageMeta({
  layout: 'login',
  middleware: ['sanctum:auth'],
});

useSeoMeta({
  title: 'Profile',
  ogTitle: 'Profile',
  description: 'Manage your profile settings and preferences.',
  ogDescription: 'Manage your profile settings and preferences.',
  author: "Ade Nafil Firmansah",
  keywords: "task management, productivity, task tracker, to-do list, task organization, Ade Nafil Firmansah, Husni Mubarok, Achmad Wildan Muzaky",

})

const { user } = useUser()
const activeTab = useState('activeTab', () => 'personal')
const router = useRouter()
const { searchTerm, setSearchTerm } = useSearchState()

// Add this watch to redirect to dashboard when search is performed
watch(searchTerm, (newSearchTerm) => {
  if (newSearchTerm && newSearchTerm.trim().length > 0) {
    // Navigate to dashboard with search term
    console.log('Redirecting to dashboard with search term:', newSearchTerm)
    router.push('/dashboard')
  }
})
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <ProfileHeader />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProfileSidebar :user="user" :active-tab="activeTab" @update:active-tab="activeTab = $event" />

      <div class="md:col-span-2">
        <ProfilePersonalInfoForm v-if="activeTab === 'personal'" />
        <ProfilePasswordChangeForm v-if="activeTab === 'password'" />

        <template v-if="activeTab === 'security'">
          <ProfileSecurityLog />
          <ProfileDeleteAccountCard />
        </template>
      </div>
    </div>
  </div>
</template>