<script setup lang="ts">
definePageMeta({
  layout: 'login'
})


const { user } = useUser()
const activeTab = useState('activeTab', () => 'personal')
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <ProfileHeader />
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ProfileSidebar 
        :user="user" 
        :active-tab="activeTab" 
        @update:active-tab="activeTab = $event" 
      />
      
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