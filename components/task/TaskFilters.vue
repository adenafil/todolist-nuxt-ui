<!-- components/task/TaskFilters.vue -->
<script setup lang="ts">
import type { PropType } from 'vue'
import type { TaskFilter } from '~/types/task'
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps({
    activeFilter: {
        type: String as PropType<TaskFilter>,
        required: true
    },
    taskCounts: {
        type: Object,
        required: true,
        // Tambahkan default untuk mencegah undefined
        default: () => ({
            all: 0,
            inProgress: 0,
            completed: 0,
            expired: 0,
            priorityHigh: 0,
            priorityMedium: 0,
            priorityLow: 0
        })
    }
})

const emit = defineEmits(['update:filter'])

// Fungsi untuk memastikan filter priority berfungsi dengan benar
const setFilter = (filter: TaskFilter) => {
    console.log('Setting filter to:', filter)
    emit('update:filter', filter)
    console.log('Emitted filter update event with value:', filter)
}

// Group tabs for better organization
const mainTabs = [
    {
        id: 'all',
        label: 'All Tasks',
        icon: 'i-heroicons-list-bullet',
        color: 'neutral',
        count: 'all'
    },
    {
        id: 'in-progress',
        label: 'In Progress',
        icon: 'i-heroicons-clock',
        color: 'warning',
        count: 'inProgress'
    },
    {
        id: 'completed',
        label: 'Completed',
        icon: 'i-heroicons-check-circle',
        color: 'primary',
        count: 'completed'
    },
    {
        id: 'expired',
        label: 'Expired',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error',
        count: 'expired'
    }
]

// Priority filter dropdown options - tetap untuk referensi data
const priorityOptions = [
    {
        id: 'priority-high',
        label: 'High Priority',
        icon: 'i-heroicons-arrow-trending-up',
        color: 'error',
        count: 'priorityHigh'
    },
    {
        id: 'priority-medium',
        label: 'Medium Priority',
        icon: 'i-heroicons-minus',
        color: 'warning',
        count: 'priorityMedium'
    },
    {
        id: 'priority-low',
        label: 'Low Priority',
        icon: 'i-heroicons-arrow-trending-down',
        color: 'success',
        count: 'priorityLow'
    }
]

// PERBAIKAN: Membuat array items untuk UDropdownMenu
// PERBAIKAN: Menambahkan safe check untuk taskCounts
const dropdownItems = computed(() => {
    return priorityOptions.map(option => ({
        label: option.label,
        icon: option.icon,
        // Fungsi yang akan dipanggil saat item diklik
        onSelect: () => {
            console.log('Dropdown item clicked:', option.id)
            setFilter(option.id as TaskFilter)
        },
        // Badge dengan defensive coding
        badge: {
            color: option.color,
            // Tambahkan null check dan default value
            label: (props.taskCounts && props.taskCounts[option.count] !== undefined)
                ? props.taskCounts[option.count].toString()
                : '0'
        }
    })) as DropdownMenuItem[]
})

// Check if current filter is a priority filter
const isPriorityFilter = computed(() => {

    return typeof props.activeFilter === 'string' && props.activeFilter.startsWith('priority-')
})

// Get active priority option for dropdown display
const activePriorityOption = computed(() => {
    if (isPriorityFilter.value) {
        const option = priorityOptions.find(option => option.id === props.activeFilter)
        return option || priorityOptions[0]
    }
    return { label: 'Priority Filter', icon: 'i-heroicons-adjustments-horizontal', color: 'neutral' }
})
</script>

<template>
    <!-- Tambahkan debugging info untuk membantu pelacakan di masa depan -->
    <div v-if="!props.taskCounts" class="text-xs text-red-500 p-2">
        Warning: taskCounts is undefined
    </div>

    <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
        <!-- Wrapper dengan overflow-x-auto untuk scroll horizontal pada mobile -->
        <div
            class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 -mx-4 sm:mx-0">
            <!-- Inner container dengan minimum width untuk memastikan scroll bekerja -->
            <div class="flex items-center gap-2 px-4 py-2 min-w-[500px] sm:min-w-0">
                <!-- Main filter tabs -->
                <UButtonGroup class="whitespace-nowrap">
                    <UButton v-for="tab in mainTabs" :key="tab.id"
                        :color="props.activeFilter === tab.id ? tab.color : 'neutral'"
                        :variant="props.activeFilter === tab.id ? 'soft' : 'ghost'" class="rounded-md"
                        @click="setFilter(tab.id as TaskFilter)" size="sm">
                        <UIcon :name="tab.icon" class="mr-1" />
                        {{ tab.label }}
                        <UBadge size="xs" class="ml-1" :color="tab.color">
                            {{ taskCounts[tab.count] }}
                        </UBadge>
                    </UButton>
                </UButtonGroup>

                <!-- PERBAIKAN: Menggunakan UDropdownMenu dengan array items -->
                <UDropdownMenu :items="dropdownItems" :ui="{ content: 'w-48' }">
                    <UButton :color="isPriorityFilter ? activePriorityOption.color : 'neutral'"
                        :variant="isPriorityFilter ? 'soft' : 'ghost'" size="sm" class="rounded-md whitespace-nowrap"
                        trailing-icon="i-heroicons-chevron-down">
                        <UIcon v-if="activePriorityOption && activePriorityOption.icon"
                            :name="activePriorityOption.icon" class="mr-1" />
                        <span>{{ isPriorityFilter ? (activePriorityOption ? activePriorityOption.label : 'Priority') :
                            'Priority Filter' }}</span>
                    </UButton>
                </UDropdownMenu>
            </div>
        </div>

        <!-- Mobile scroll indicator -->
        <div class="sm:hidden text-xs text-center text-gray-500 mt-1 mb-2">
            <span class="flex items-center justify-center">
                <UIcon name="i-heroicons-arrows-right-left" class="h-3 w-3 mr-1" />
                Swipe for more filters
            </span>
        </div>
    </div>
</template>