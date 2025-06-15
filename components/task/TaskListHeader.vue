<script setup lang="ts">
import { useTasks } from '~/composables/task/useTasks'

defineProps({
    filteredCount: {
        type: Number,
        required: true
    },
    totalCount: {
        type: Number,
        required: true
    },
    searchTerm: {
        type: String,
        default: ''
    },
    itemsPerPage: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['update:items-per-page', 'add-task'])

const updateItemsPerPage = (value: number) => {    
    emit('update:items-per-page', value)
}

const openAddTaskModal = () => {
    emit('add-task')
}

const { isLoading, exportTasks, totalTasks } = useTasks();
</script>

<template>
    <div class="flex justify-between items-center">
        <h2 class="text-lg font-medium">
            Your Tasks
            <span v-if="searchTerm" class="text-sm text-gray-500">
                (filtered: {{ filteredCount }} of {{ totalCount }})
            </span>
        </h2>
        <div class="flex items-center gap-2">
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500 hidden sm:inline">Per page:</span>
                <UInput :modelValue="itemsPerPage" type="number" :min="1" :max="50" size="sm" class="w-16"
                    @update:model-value="updateItemsPerPage(Number($event === '' ? 0 : $event))" />
            </div>

            <!-- <UButton 
                class="cursor-pointer"
                color="secondary" 
                variant="soft"
                icon="i-heroicons-arrow-down-tray" 
                size="sm" 
                :loading="isLoading"
                :disabled ="isLoading || totalTasks === 0"
                @click="exportTasks"
            >
                Export Tasks
            </UButton>

 -->
            <UButton class="cursor-pointer" color="primary" icon="i-heroicons-plus" size="sm" @click="openAddTaskModal">
                Add Task
            </UButton>
        </div>
    </div>
</template>