<script setup lang="ts">
import { useTasks } from '~/composables/task/useTasks'
import { useTaskFilters } from '~/composables/task/useTaskFilters'
import { useTaskPagination } from '~/composables/task/useTaskPagination'
import { useTaskStats } from '~/composables/task/useTaskStats'
import { useTaskModals } from '~/composables/task/useTaskModals'
import { useSearchState } from '~/composables/useSearchState'

// Define page meta
definePageMeta({
  layout: 'login' // Using login layout with navbarLogin
})

// Get the shared search state
const { searchTerm, setSearchTerm } = useSearchState()

// Initialize other composables
const { tasks, addTask, deleteTask, toggleTaskComplete, updateTask } = useTasks()

// Modify useTaskFilters to use the shared search term
const {
  activeFilter, sortOrder,
  filteredAndSortedTasks, taskCounts,
  setActiveFilter, setSortOrder
} = useTaskFilters(tasks, searchTerm) // Pass searchTerm as a parameter

const { currentPage, itemsPerPage, paginatedTasks, setItemsPerPage, setPage } = useTaskPagination(filteredAndSortedTasks) // Use the sorted tasks
const { taskStats } = useTaskStats(filteredAndSortedTasks)
const {
  isAddTaskModalOpen, isEditTaskModalOpen, currentTaskToEdit,
  openAddTaskModal, closeAddTaskModal, openEditTaskModal, closeEditTaskModal
} = useTaskModals()

// Add watch to ensure changes are detected
watch(currentPage, (newPage) => {
  console.log('Current page changed to:', newPage)
  console.log('Current paginated tasks:', paginatedTasks.value)
})

const isExpired = (dueDate: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset waktu ke awal hari
  const taskDate = new Date(dueDate)
  return taskDate < today
}

const getStatusColor = (task: Task): string => {
  if (task.completed) return 'green'
  if (isExpired(task.dueDate)) return 'red'
  return 'warning' // Menggunakan warning untuk in progress
}

// Watch yang lebih lengkap untuk debugging
watch(activeFilter, (newFilter, oldFilter) => {
  console.log(`Filter changed: ${oldFilter} -> ${newFilter}`);
  console.log('Filtered tasks:', filteredAndSortedTasks.value.length);
  console.log('Task counts:', taskCounts.value);
});
</script>

<template>
  <div>
    <!-- Dashboard Header with Search Notification -->
    <DashboardHeader :search-term="searchTerm" @clear-search="setSearchTerm('')" />

    <!-- Stats Overview -->
    <DashboardStats :stats="taskStats" />

    <!-- Tasks List Card -->
    <UCard>
      <template #header>
        <TaskListHeader :filtered-count="filteredAndSortedTasks.length" :total-count="tasks.length"
          :search-term="searchTerm" :items-per-page="itemsPerPage" :sort-order="sortOrder"
          @update:items-per-page="setItemsPerPage" @update:sort-order="setSortOrder" @add-task="openAddTaskModal" />
      </template>

      <!-- Filter Tabs -->
      <TaskFilters :active-filter="activeFilter" :task-counts="taskCounts" @update:filter="setActiveFilter" />

      <!-- Debug indicator untuk membantu troubleshooting -->
      <div class="text-xs text-gray-500 mb-2">
        Active filter: {{ activeFilter }} |
        Filtered items: {{ filteredAndSortedTasks.length }}
      </div>

      <!-- Task List Component -->
      <TaskList :tasks="paginatedTasks" @toggle-complete="toggleTaskComplete" @delete-task="deleteTask"
        @edit-task="openEditTaskModal">
        <template #task="{ task }">
          <UBadge :color="getStatusColor(task)" size="xs">
            {{ task.completed ? 'Completed' : isExpired(task.dueDate) ? 'Expired' : 'In Progress' }}
          </UBadge>
        </template>
      </TaskList>

      <!-- Empty state message when no tasks -->
      <TaskEmptyState v-if="filteredAndSortedTasks.length === 0" :search-term="searchTerm.value"
        :active-filter="activeFilter" />

      <!-- Pagination dengan handler eksplisit -->
      <div class="py-4 flex justify-center" v-if="filteredAndSortedTasks.length > 0">
        <UPagination v-model:page="currentPage" :total="filteredAndSortedTasks.length"
          :page-count="Math.ceil(filteredAndSortedTasks.length / itemsPerPage)" :items-per-page="itemsPerPage" :ui="{
            root: 'flex items-center gap-1',
            item: 'rounded-md text-sm',
            prev: 'text-sm',
            next: 'text-sm'
          }" />
      </div>
    </UCard>

    <!-- Task Modals -->
    <TaskAddTaskModal :is-open="isAddTaskModalOpen" @close="closeAddTaskModal" @add-task="addTask" />

    <TaskAddTaskModal :is-open="isEditTaskModalOpen" :edit-mode="true" :task-to-edit="currentTaskToEdit"
      @close="closeEditTaskModal" @update-task="updateTask" />
  </div>
</template>
