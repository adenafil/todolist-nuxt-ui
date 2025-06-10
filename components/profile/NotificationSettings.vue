<script setup lang="ts">
const {
  isSupported,
  isPermissionGranted,
  requestPermission,
  subscribeUser,
  unsubscribeUser
} = useWebPush()

const notificationSettings = reactive({
  taskReminders: false,
  dailyDigest: false,
  dueDateAlerts: false
})

const isLoading = ref(false)

const handleNotificationToggle = async () => {
  if (!notificationSettings.taskReminders) {
    await unsubscribeUser()
    return
  }

  isLoading.value = true

  try {
    const permissionGranted = await requestPermission()
    if (permissionGranted) {
      await subscribeUser()
    } else {
      notificationSettings.taskReminders = false
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  notificationSettings.taskReminders = isPermissionGranted.value
})
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-medium">Notification Settings</h3>
    </template>

    <div class="space-y-4">
      <div v-if="!isSupported" class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <p class="text-sm text-yellow-700 dark:text-yellow-200">
          Your browser doesn't support push notifications.
        </p>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium">Task Reminders</h4>
          <p class="text-sm text-gray-500">
            Receive notifications when tasks are due soon. <br> A reminder will be sent about 5 hours before the due time,
            and
            will repeat every 5 minutes.
          </p>
        </div>
        <USwitch v-model="notificationSettings.taskReminders" :disabled="!isSupported || isLoading"
          @change="handleNotificationToggle" />
      </div>

    </div>
  </UCard>
</template>