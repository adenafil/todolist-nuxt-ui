<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
    <UIcon :name="icon" class="text-3xl text-primary-500 mb-3 mx-auto" />
    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <p class="text-gray-600 dark:text-gray-400">{{ description }}</p>
  </div>
</template>