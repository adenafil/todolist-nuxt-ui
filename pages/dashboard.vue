<script setup lang="ts">
import TaskList from '~/components/task/TaskList.vue';

// Gunakan definePageMeta hanya sekali
definePageMeta({
    layout: 'login' // Menggunakan layout login yang berisi navbarLogin
})

interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    priority: string;
    dueDate: string;
}

// Reactive tasks array
const tasks = ref<Task[]>([
    {
        id: 1,
        title: 'Research UI frameworks',
        description: 'Evaluate different UI frameworks like Tailwind, Bootstrap, and Material UI for the new project.',
        completed: true,
        priority: 'high',
        dueDate: '2025-05-01'
    },
    {
        id: 2,
        title: 'Design dashboard layout',
        description: 'Create wireframes and mockups for the main dashboard using Figma.',
        completed: false,
        priority: 'medium',
        dueDate: '2025-05-03'
    },
    {
        id: 3,
        title: 'Implement authentication flow',
        description: 'Set up JWT authentication with refresh tokens and secure storage.',
        completed: false,
        priority: 'high',
        dueDate: '2025-05-05'
    },
    {
        id: 4,
        title: 'Create database schema',
        description: 'Design and implement the database schema for users, tasks, and projects.',
        completed: false,
        priority: 'low',
        dueDate: '2025-05-10'
    }
])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(5) // Menampilkan 5 task per halaman

// Search functionality
const searchTerm = ref('')

// Handle search events directly
const handleSearch = (term) => {
    searchTerm.value = term
    currentPage.value = 1 // Reset ke halaman pertama saat pencarian berubah
}

// State untuk filter tab
const activeFilter = ref('all') // 'all', 'in-progress', atau 'completed'

// Modifikasi computed filteredTasks untuk menerapkan filter tab
const filteredTasks = computed(() => {
    console.log('Filtering tasks with term:', searchTerm.value, 'and filter:', activeFilter.value)
    
    // Step 1: Filter berdasarkan search term
    let filtered = tasks.value
    
    if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase().trim()
        filtered = filtered.filter(task =>
            task.title.toLowerCase().includes(term) ||
            (task.description && task.description.toLowerCase().includes(term))
        )
    }
    
    // Step 2: Filter berdasarkan tab aktif
    if (activeFilter.value === 'in-progress') {
        filtered = filtered.filter(task => !task.completed)
    } else if (activeFilter.value === 'completed') {
        filtered = filtered.filter(task => task.completed)
    }
    
    // Reset pagination jika diperlukan
    if (filtered.length <= (currentPage.value - 1) * itemsPerPage.value) {
        currentPage.value = 1
    }
    
    return filtered
})

// Computed paginated tasks - subset dari filtered tasks untuk halaman saat ini
const paginatedTasks = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    const endIndex = startIndex + itemsPerPage.value
    return filteredTasks.value.slice(startIndex, endIndex)
})

// Computed statistics based on filtered tasks
const taskStats = computed(() => [
    {
        label: 'Total Tasks',
        value: filteredTasks.value.length,
        icon: 'i-heroicons-clipboard-document-list',
        color: 'blue'
    },
    {
        label: 'Completed',
        value: filteredTasks.value.filter(t => t.completed).length,
        icon: 'i-heroicons-check-circle',
        color: 'green'
    },
    {
        label: 'In Progress',
        value: filteredTasks.value.filter(t => !t.completed).length,
        icon: 'i-heroicons-clock',
        color: 'amber'
    },
    {
        label: 'High Priority',
        value: filteredTasks.value.filter(t => t.priority === 'high').length,
        icon: 'i-heroicons-exclamation-triangle',
        color: 'red'
    }
])

// Hitung jumlah task per kategori
const taskCounts = computed(() => {
    return {
        all: tasks.value.length,
        inProgress: tasks.value.filter(t => !t.completed).length,
        completed: tasks.value.filter(t => t.completed).length
    }
})

// Modal states
const isAddTaskModalOpen = ref(false)
const isEditTaskModalOpen = ref(false)
const currentTaskToEdit = ref<Task | null>(null)

// Task management functions
const addTask = (newTask: Task) => {
    tasks.value.push(newTask)
}

const deleteTask = (taskId: number) => {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
        tasks.value.splice(index, 1)
    }
}

const toggleTaskComplete = (taskId: number) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
        task.completed = !task.completed
    }
}

// Fungsi untuk membuka modal edit
const openEditTaskModal = (task: Task) => {
    currentTaskToEdit.value = { ...task } // Clone task to avoid reference issues
    isEditTaskModalOpen.value = true
}

// Fungsi untuk memperbarui task yang sudah ada
const updateTask = (updatedTask: Task) => {
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
        tasks.value[index] = { ...updatedTask }
    }
}

// Listener event bus - tambahkan dengan reset pagination
const { $bus } = useNuxtApp()
onMounted(() => {
    // Subscribe to search events from navbar
    $bus.on('search', (term) => {
        console.log('Event bus received search term:', term)
        searchTerm.value = term
        currentPage.value = 1 // Reset ke halaman pertama saat pencarian berubah
    })
})

onBeforeUnmount(() => {
    // Clean up event listeners
    $bus.off('search')
})
</script>

<template>
    <div>
        <!-- Dashboard Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold mb-1 text-gray-800 dark:text-white">Dashboard</h1>
            <p class="text-gray-500 dark:text-gray-400">Welcome to your task management dashboard</p>

            <!-- Active search notification -->
            <div v-if="searchTerm"
                class="mt-2 p-2 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200 rounded-md flex items-center">
                <UIcon name="i-heroicons-magnifying-glass" class="mr-2" />
                <span>Showing results for: <strong>{{ searchTerm }}</strong></span>
                <UButton icon="i-heroicons-x-mark" variant="ghost" color="gray" size="xs" class="ml-auto"
                    @click="searchTerm = ''" />
            </div>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <UCard v-for="stat in taskStats" :key="stat.label" class="flex items-center">
                <UIcon :name="stat.icon" :class="`text-${stat.color}-500 text-xl mr-3`" />
                <div>
                    <div class="text-2xl font-bold">{{ stat.value }}</div>
                    <div class="text-sm text-gray-500">{{ stat.label }}</div>
                </div>
            </UCard>
        </div>

        <!-- Tasks List Card -->
        <UCard>
            <template #header>
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-medium">
                        Your Tasks
                        <span v-if="searchTerm" class="text-sm text-gray-500">
                            (filtered: {{ filteredTasks.length }} of {{ tasks.length }})
                        </span>
                    </h2>
                    <div class="flex items-center gap-2">
                        <!-- Ganti dengan UInput type number -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500 hidden sm:inline">Per page:</span>
                            <UInput v-model="itemsPerPage" type="number" :min="1" :max="50" size="sm" class="w-16"
                                @update:model-value="currentPage = 1" />
                        </div>
                        <UButton color="primary" icon="i-heroicons-plus" size="sm" @click="isAddTaskModalOpen = true">
                            Add Task
                        </UButton>
                    </div>
                </div>
            </template>

            <!-- Filter Tabs -->
            <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
                <UButtonGroup class="mb-[-1px] px-4 py-2">
                    <UButton 
                        :color="activeFilter === 'all' ? 'primary' : 'gray'"
                        :variant="activeFilter === 'all' ? 'soft' : 'ghost'"
                        class="rounded-b-none border-b-2"
                        :class="activeFilter === 'all' ? 'border-primary-500' : 'border-transparent'"
                        @click="activeFilter = 'all'; currentPage = 1"
                        size="sm"
                    >
                        <UIcon name="i-heroicons-list-bullet" class="mr-1" />
                        All Tasks
                        <UBadge size="xs" class="ml-1" color="gray">{{ taskCounts.all }}</UBadge>
                    </UButton>
                    <UButton 
                        :color="activeFilter === 'in-progress' ? 'primary' : 'gray'"
                        :variant="activeFilter === 'in-progress' ? 'soft' : 'ghost'"
                        class="rounded-b-none border-b-2"
                        :class="activeFilter === 'in-progress' ? 'border-primary-500' : 'border-transparent'"
                        @click="activeFilter = 'in-progress'; currentPage = 1"
                        size="sm"
                    >
                        <UIcon name="i-heroicons-clock" class="mr-1" />
                        In Progress
                        <UBadge size="xs" class="ml-1" color="amber">{{ taskCounts.inProgress }}</UBadge>
                    </UButton>
                    <UButton 
                        :color="activeFilter === 'completed' ? 'primary' : 'gray'"
                        :variant="activeFilter === 'completed' ? 'soft' : 'ghost'"
                        class="rounded-b-none border-b-2"
                        :class="activeFilter === 'completed' ? 'border-primary-500' : 'border-transparent'"
                        @click="activeFilter = 'completed'; currentPage = 1"
                        size="sm"
                    >
                        <UIcon name="i-heroicons-check-circle" class="mr-1" />
                        Completed
                        <UBadge size="xs" class="ml-1" color="green">{{ taskCounts.completed }}</UBadge>
                    </UButton>
                </UButtonGroup>
            </div>

            <!-- Custom Task List Component - Menggunakan paginatedTasks -->
            <TaskList :tasks="paginatedTasks" @toggle-complete="toggleTaskComplete" @delete-task="deleteTask"
                @edit-task="openEditTaskModal" />

            <!-- Empty state message jika tidak ada task -->
            <div v-if="filteredTasks.length === 0" class="py-8 text-center text-gray-500">
                <div v-if="searchTerm">
                    <UIcon name="i-heroicons-magnifying-glass" class="mx-auto mb-2 text-3xl" />
                    <p>No tasks found matching your search criteria.</p>
                </div>
                <div v-else>
                    <UIcon name="i-heroicons-clipboard" class="mx-auto mb-2 text-3xl" />
                    <p v-if="activeFilter === 'all'">You don't have any tasks yet.</p>
                    <p v-else-if="activeFilter === 'in-progress'">You don't have any in-progress tasks.</p>
                    <p v-else>You don't have any completed tasks.</p>
                </div>
            </div>

            <!-- Pagination di bawah task list -->
            <div class="py-4 flex justify-center" v-if="filteredTasks.length > 0">
                <UPagination v-model="currentPage" :total="filteredTasks.length"
                    :page-count="Math.ceil(filteredTasks.length / itemsPerPage)" :items-per-page="itemsPerPage" :ui="{
                        wrapper: 'flex items-center gap-1',
                        rounded: 'rounded-md',
                        default: {
                            size: 'sm'
                        }
                    }" />
            </div>
        </UCard>

        <!-- Add Task Modal -->
        <TaskAddTaskModal :is-open="isAddTaskModalOpen" @close="isAddTaskModalOpen = false" @add-task="addTask" />

        <!-- Edit Task Modal -->
        <TaskAddTaskModal :is-open="isEditTaskModalOpen" :edit-mode="true" :task-to-edit="currentTaskToEdit"
            @close="isEditTaskModalOpen = false" @update-task="updateTask" />
    </div>
</template>