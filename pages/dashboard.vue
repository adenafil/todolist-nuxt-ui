<script setup lang="ts">
import { useTaskFilters } from '~/composables/task/useTaskFilters'
import { useTaskPagination } from '~/composables/task/useTaskPagination'
import { useTaskStats } from '~/composables/task/useTaskStats'
import { useTaskModals } from '~/composables/task/useTaskModals'
import { useSearchState } from '~/composables/useSearchState'
import { useTasks } from '~/composables/task/useTasks'
import { useRouteQuery } from '~/composables/useRouteQuery'

// Define page meta
definePageMeta({
  layout: 'login',
  middleware: ['sanctum:auth'],
})

// Get route query parameters
const {
  page: queryPage,
  search: querySearch,
  filter: queryFilter,
  sort: querySort,
  perPage: queryPerPage,
  updatePage,
  updateSearch,
  updateFilter,
  updateSort,
  updatePerPage
} = useRouteQuery()

// Get the shared search state
const { searchTerm, setSearchTerm } = useSearchState()

// Set initial search term from URL
onMounted(() => {
  if (querySearch.value) {
    setSearchTerm(querySearch.value)
  }
})

// Initialize tasks composable
const { tasks, isLoading, totalPages, currentPage, fetchTasks, addTask, deleteTask, totalTasks, toggleTaskComplete, updateTask } = useTasks()

// Use task filters with shared search term
const {
  activeFilter, sortOrder,
  taskCounts,
  setActiveFilter, setSortOrder
} = useTaskFilters(tasks, searchTerm)

// Since filtering happens on the API, we can use the tasks directly for pagination
const { itemsPerPage, paginatedTasks, setItemsPerPage, setPage } = useTaskPagination(tasks)
const { taskStats } = useTaskStats(tasks)
const {
  isAddTaskModalOpen, isEditTaskModalOpen, currentTaskToEdit,
  openAddTaskModal, closeAddTaskModal, openEditTaskModal, closeEditTaskModal
} = useTaskModals()

// Sync initial state with URL query params on mount
onMounted(() => {
  // Set initial values from URL
  if (queryPage.value > 1) setPage(queryPage.value)
  if (queryFilter.value !== 'all') setActiveFilter(queryFilter.value)
  if (querySort.value !== 'date-asc') setSortOrder(querySort.value)
  if (queryPerPage.value !== 5) setItemsPerPage(queryPerPage.value)

  // Use the helper function for the initial fetch
  fetchTasks(createTaskParams());
})

// Helper function to map filters to API status
function mapFilterToApiStatus(filter: string): string {
  if (filter === 'in-progress') return 'in_progress'
  if (filter === 'completed') return 'completed'
  if (filter === 'expired') return 'expired'
  if (filter.startsWith('priority-')) return filter.replace('priority-', '')
  return 'all'
}

// Add this helper function to create consistent API parameters
function createTaskParams(overrides = {}) {
  const baseParams = {
    page: currentPage.value,
    per_page: itemsPerPage.value,
    sort_by: sortOrder.value.split('-')[0] === 'date' ? 'due_date' : 'priority',
    sort_direction: sortOrder.value.split('-')[1]
  };

  // Only add search parameter if it has a value
  if (searchTerm.value) {
    baseParams.search = searchTerm.value;
  }

  // Add filter parameters
  if (activeFilter.value !== 'all') {
    if (activeFilter.value.startsWith('priority-')) {
      baseParams.priority = activeFilter.value.replace('priority-', '');
    } else {
      baseParams.status = mapFilterToApiStatus(activeFilter.value);
    }
  }

  // Override with any passed parameters
  return { ...baseParams, ...overrides };
}

// Watch query parameters for changes & update state
watch(queryPage, (newPage) => {
  if (newPage !== currentPage.value) {
    setPage(newPage)
  }
})

watch(queryFilter, (newFilter) => {
  if (newFilter !== activeFilter.value) {
    setActiveFilter(newFilter)
  }
})

watch(querySort, (newSort) => {
  if (newSort !== sortOrder.value) {
    setSortOrder(newSort)
  }
})

watch(queryPerPage, (newPerPage) => {
  if (newPerPage !== itemsPerPage.value) {
    setItemsPerPage(newPerPage)
  }
})

watch(querySearch, (newSearch) => {
  if (newSearch !== searchTerm.value) {
    setSearchTerm(newSearch)
  }
})

watch(currentPage, (newPage) => {
  updatePage(newPage)
  fetchTasks(createTaskParams({ page: newPage }));
})

watch(activeFilter, (newFilter) => {
  updateFilter(newFilter)
})

watch(sortOrder, (newSort) => {
  updateSort(newSort)
})

watch(itemsPerPage, (newPerPage) => {
  updatePerPage(newPerPage)
  fetchTasks(createTaskParams({ per_page: newPerPage }));
})

watch(searchTerm, (newSearch) => {
  updateSearch(newSearch)
  fetchTasks(createTaskParams({ search: newSearch, page: 1 }));
})

// Custom handlers that both update state and URL
const handleSetPage = (newPage: number) => {
  setPage(newPage)
  // If you're directly calling fetchTasks here, include per_page
  fetchTasks({ page: newPage, per_page: itemsPerPage.value });
}

const handleClearSearch = () => {
  setSearchTerm('')
  updateSearch('')
  // Reload with default filters
  fetchTasks({ page: 1 });
}

const handleSetActiveFilter = (filter: string) => {
  setActiveFilter(filter)
  updateFilter(filter)
}

const handleSetItemsPerPage = (count: number) => {
  setItemsPerPage(count)
  updatePerPage(count)
}

const handleSetSortOrder = (order: string) => {
  setSortOrder(order)
  updateSort(order)
  fetchTasks(createTaskParams());
}


</script>

<template>

  <div>
    <!-- Dashboard Header with Search Notification -->
    <DashboardHeader :search-term="searchTerm" @clear-search="handleClearSearch" />

    <!-- Stats Overview -->
    <DashboardStats :stats="taskStats" />


    <!-- Tasks List Card -->
    <UCard>
      <template #header>
        <TaskListHeader :filtered-count="tasks.length" :total-count="tasks.length" :search-term="searchTerm"
          :items-per-page="itemsPerPage" :sort-order="sortOrder" @update:items-per-page="handleSetItemsPerPage"
          @update:sort-order="handleSetSortOrder" @add-task="openAddTaskModal" />
      </template>

      <!-- Filter Tabs -->
      <TaskFilters :active-filter="activeFilter" :task-counts="taskCounts" @update:filter="handleSetActiveFilter" />



      <div v-if="isLoading" class="overflow-x-auto -mx-4 sm:-mx-0">
        <div class="min-w-[800px] sm:min-w-full">
          <!-- Table Header -->
          <div
            class="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky left-0">
            <div class="col-span-5 font-medium">Task</div>
            <div class="col-span-2 font-medium">Priority</div>
            <div class="col-span-2 font-medium">Due Date</div>
            <div class="col-span-2 font-medium">Status</div>
            <div class="col-span-1 font-medium text-right">Actions</div>
          </div>

          <!-- Skeleton Rows -->
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="i in itemsPerPage" :key="`skeleton-${i}`" class="grid grid-cols-12 gap-4 p-4 items-center">
              <div class="col-span-5 flex items-center gap-2">
                <USkeleton class="h-4 w-4 rounded-md" />
                <USkeleton class="h-5 w-48" />
              </div>
              <div class="col-span-2">
                <USkeleton class="h-6 w-16 rounded-full" />
              </div>
              <div class="col-span-2">
                <USkeleton class="h-4 w-24" />
              </div>
              <div class="col-span-2">
                <USkeleton class="h-6 w-20 rounded-full" />
              </div>
              <div class="col-span-1 flex justify-end gap-1">
                <USkeleton class="h-8 w-8 rounded-md" />
                <USkeleton class="h-8 w-8 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Task List Component -->
      <TaskList v-else :tasks="paginatedTasks" @toggle-complete="toggleTaskComplete" @delete-task="deleteTask"
        @edit-task="openEditTaskModal" />



      <!-- Empty state message when no tasks -->
      <TaskEmptyState v-if="!isLoading && tasks.length === 0" :search-term="searchTerm" :active-filter="activeFilter" />

      <!-- Pagination -->
      <div class="py-4 flex justify-center">
        <template v-if="isLoading || tasks.length === 0">
          <USkeleton class="h-8 w-48 rounded-md" />
        </template>
        <template v-else>
          <UPagination v-model:page="currentPage" :total="totalTasks" :page-count="totalPages"
            :items-per-page="itemsPerPage" @update:page="handleSetPage" :ui="{
              root: 'flex items-center gap-1',
              item: 'rounded-md text-sm',
              prev: 'text-sm',
              next: 'text-sm'
            }" />
        </template>
      </div>

    </UCard>

    <!-- Task Modals -->
    <TaskAddTaskModal :is-open="isAddTaskModalOpen" @close="closeAddTaskModal" @add-task="addTask" />

    <TaskAddTaskModal :is-open="isEditTaskModalOpen" :edit-mode="true" :task-to-edit="currentTaskToEdit"
      @close="closeEditTaskModal" @update-task="updateTask" />
  </div>
</template>
