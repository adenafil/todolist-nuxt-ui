<script setup lang="ts">
import type { Task } from '~/types/task';
import { getTaskStatus, getStatusColor, getStatusLabel } from '~/utils/taskStatus';
import { getPriorityColor } from '~/utils/taskPriority';
import { formatDate } from '~/utils/dates';

const props = defineProps({
    tasks: {
        type: Array as PropType<Task[]>,
        required: true
    }
});

const { $isHydrating } = useNuxtApp();
const emit = defineEmits(['edit-task', 'delete-task', 'toggle-complete']);

// Menambahkan expanded state untuk menampilkan deskripsi
const expandedTasks = ref(new Set());

const toggleExpandTask = (taskId) => {
    if (expandedTasks.value.has(taskId)) {
        expandedTasks.value.delete(taskId);
    } else {
        expandedTasks.value.add(taskId);
    }
};

const isTaskExpanded = (taskId) => {
    return expandedTasks.value.has(taskId);
};
</script>

<template>
    <div class="overflow-x-auto -mx-4 sm:-mx-0">
        <div class="min-w-[900px] sm:min-w-full"> <!-- Increase min-width -->
            <!-- Table Header -->
            <div
                class="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sticky left-0">
                <div class="col-span-4 font-medium">Task</div> <!-- Reduce from 5 to 4 -->
                <div class="col-span-2 font-medium">Category</div> <!-- Add category column -->
                <div class="col-span-2 font-medium">Priority</div>
                <div class="col-span-2 font-medium">Due Date</div>
                <div class="col-span-1 font-medium">Status</div>
                <div class="col-span-1 font-medium text-right">Actions</div>
            </div>

            <!-- Table Body -->
            <div v-if="tasks.length !== 0" class="divide-y divide-gray-200 dark:divide-gray-700">
                <div v-for="task in tasks" :key="task.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <!-- Main Task Row -->
                    <div class="grid grid-cols-12 gap-4 p-4 items-center">
                        <!-- Task Title -->
                        <div class="col-span-4 flex items-center gap-2"> <!-- Reduce from 5 to 4 -->
                            <UCheckbox :model-value="task.completed"
                                @update:model-value="emit('toggle-complete', task.id)" />
                            <div>
                                <span :class="{ 'line-through text-gray-500': task.completed }"
                                    class="cursor-pointer hover:text-primary-500" @click="toggleExpandTask(task.id)">
                                    {{ task.title }}
                                </span>
                                <UIcon
                                    :name="isTaskExpanded(task.id) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                    class="inline-block ml-1 h-4 w-4 text-gray-400" v-if="task.description" />
                            </div>
                        </div>

                        <!-- Category -->
                        <div class="col-span-2"> <!-- Add category display -->
                            <div v-if="task.category" class="flex items-center gap-1">
                                <UIcon :name="task.categoryIcon || 'i-heroicons-tag'" class="h-4 w-4 text-gray-500" />
                                <span class="text-sm text-gray-600 dark:text-gray-400">{{ task.category }}</span>
                            </div>
                            <span v-else class="text-xs text-gray-400">No category</span>
                        </div>

                        <!-- Priority -->
                        <div class="col-span-2">
                            <UBadge :color="getPriorityColor(task.priority)">
                                {{ task.priority }}
                            </UBadge>
                        </div>

                        <!-- Due Date -->
                        <div class="col-span-2">
                            {{ formatDate(task.dueDate) }}
                        </div>

                        <!-- Status -->
                        <div class="col-span-1"> <!-- Reduce from 2 to 1 -->
                            <UBadge :color="getStatusColor(getTaskStatus(task))">
                                {{ getStatusLabel(getTaskStatus(task)) }}
                            </UBadge>
                        </div>

                        <!-- Actions -->
                        <div class="col-span-1 flex justify-end gap-1">
                            <UButton icon="i-heroicons-pencil" color="secondary" variant="ghost" size="xs"
                                @click="emit('edit-task', task)" />
                            <UButton icon="i-heroicons-trash" color="secondary" variant="ghost" size="xs"
                                @click="emit('delete-task', task.id)" />
                        </div>
                    </div>

                    <!-- Description Section (expandable) -->
                    <div v-if="isTaskExpanded(task.id) && task.description"
                        class="px-10 pb-4 text-gray-600 dark:text-gray-300 text-sm">
                        <div class="border-l-2 border-primary-300 pl-3 py-1">
                            {{ task.description || 'No description provided.' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Mobile scroll helper - only in client -->
    <div v-if="tasks.length > 0"
        class="sm:hidden text-xs text-center text-gray-500 mt-2 flex items-center justify-center">
        <UIcon name="i-heroicons-arrows-right-left" class="h-3 w-3 mr-1" />
        <span>Swipe left/right to see more</span>
    </div>
</template>