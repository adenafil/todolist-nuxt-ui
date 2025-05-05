<!--components/task/TaskEmptyState.vue -->
<script setup lang="ts">
import type { PropType } from 'vue'
import type { TaskFilter } from '~/types/task'

const props = defineProps({
  searchTerm: {
    type: String,
    default: ''
  },
  activeFilter: {
    type: String as PropType<TaskFilter>,
    required: true
  }
})

// Helper untuk menentukan pesan berdasarkan filter
const emptyStateMessage = computed(() => {
  if (props.searchTerm) {
    return 'No tasks found matching your search criteria.'
  }

  if (props.activeFilter === 'all') {
    return 'You don\'t have any tasks yet.'
  }

  if (props.activeFilter === 'in-progress') {
    return 'You don\'t have any in-progress tasks.'
  }

  if (props.activeFilter === 'completed') {
    return 'You don\'t have any completed tasks.'
  }

  if (props.activeFilter === 'expired') {
    return 'You don\'t have any expired tasks.'
  }

  if (props.activeFilter === 'priority-high') {
    return 'You don\'t have any high priority tasks.'
  }

  if (props.activeFilter === 'priority-medium') {
    return 'You don\'t have any medium priority tasks.'
  }

  if (props.activeFilter === 'priority-low') {
    return 'You don\'t have any low priority tasks.'
  }

  return 'No tasks found.'
})

// Helper untuk menentukan icon berdasarkan filter
const emptyStateIcon = computed(() => {
  if (props.searchTerm) {
    return 'i-heroicons-magnifying-glass'
  }

  if (props.activeFilter.startsWith('priority-')) {
    return 'i-heroicons-adjustments-horizontal'
  }

  return 'i-heroicons-clipboard'
})
</script>

<template>
  <div class="py-8 text-center text-gray-500">
    <UIcon :name="emptyStateIcon" class="mx-auto mb-2 text-3xl" />
    <p>{{ emptyStateMessage }}</p>
  </div>
</template>