<script setup lang="ts">
import { object, z } from 'zod'
import { useTasks } from '~/composables/task/useTasks'
import { useTaskCategories } from '~/composables/task/useTaskCategories'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    editMode: {
        type: Boolean,
        default: false
    },
    taskToEdit: {
        type: Object,
        default: null
    },
})

const emit = defineEmits(['close', 'add-task', 'update-task'])

// Tambahkan description ke skema validasi
const taskSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    priority: z.string({
        required_error: 'Please select a priority'
    }),
    due_date: z.string().min(1, 'Due date is required')
})

// Tambahkan di bagian reactive data
const newTask = reactive({
    title: '',
    description: '',
    category: '',
    categoryIcon: 'i-heroicons-tag',
    priority: 'medium',
    due_date: new Date().toISOString().slice(0, 10),
    completed: 'in_progress'
})

// Items untuk select menu dengan warna yang sesuai
const priorityItems = [
    { label: 'High Priority', value: 'high', color: 'red' },
    { label: 'Medium Priority', value: 'medium', color: 'yellow' },
    { label: 'Low Priority', value: 'low', color: 'green' }
]

// Tambahkan state untuk suggestions dan icon options
const showSuggestions = ref(false)
const showIconOptions = ref(false)

// Gunakan composable untuk kategori
const { categories: categorySuggestions, isLoading: isLoadingCategories, fetchCategories } = useTaskCategories()

// Icon options - updated to match all icons from useTaskCategories
const iconOptions = [
    { value: 'i-heroicons-home' },
    { value: 'i-heroicons-briefcase' },
    { value: 'i-heroicons-user' },
    { value: 'i-heroicons-academic-cap' },
    { value: 'i-heroicons-heart' },
    { value: 'i-heroicons-shopping-cart' },
    { value: 'i-heroicons-globe-alt' },
    { value: 'i-heroicons-currency-dollar' },
    { value: 'i-heroicons-film' },
    { value: 'i-heroicons-fire' },
    { value: 'i-heroicons-users' },
    { value: 'i-heroicons-trophy' },
    { value: 'i-heroicons-cake' },
    { value: 'i-heroicons-book-open' },
    { value: 'i-heroicons-computer-desktop' },
    { value: 'i-heroicons-paint-brush' },
    { value: 'i-heroicons-chat-bubble-left-right' },
    { value: 'i-heroicons-scissors' },
    { value: 'i-heroicons-truck' },
    { value: 'i-heroicons-exclamation-triangle' },
    { value: 'i-heroicons-puzzle-piece' },
    { value: 'i-heroicons-calendar-days' },
    { value: 'i-heroicons-tag' }
]



onMounted(() => {
    // Fetch categories saat component dimount
    fetchCategories()
});

// Computed untuk selected icon
const selectedIcon = computed(() => newTask.categoryIcon || 'i-heroicons-tag')

// Computed property untuk menangani konversi object/string
const selectedPriority = computed({
    get() {
        // Mencari item berdasarkan value di newTask.priority
        return priorityItems.find(item => item.value === newTask.priority) || newTask.priority;
    },
    set(val) {
        // Pastikan selalu menyimpan string value, bukan objek
        newTask.priority = typeof val === 'object' && val !== null ? val.value : val;
    }
});

// Computed untuk filtered suggestions
const filteredSuggestions = computed(() => {
    if (!newTask.category) return categorySuggestions.value
    return categorySuggestions.value.filter(suggestion =>
        suggestion.name.toLowerCase().includes(newTask.category.toLowerCase())
    )
})

// Jika dalam mode edit, isi form dengan data task yang akan diedit
watch(() => props.taskToEdit, (newVal) => {
    console.log(newVal);

    if (newVal && props.editMode) {
        newTask.title = newVal.title || '';
        newTask.description = newVal.description || '';
        newTask.category = newVal.category || '';
        newTask.categoryIcon = newVal.categoryIcon || 'i-heroicons-tag';
        newTask.priority = newVal.priority || 'medium';
        newTask.due_date = newVal.dueDate || new Date().toISOString().slice(0, 10);
        newTask.completed = newVal.completed || false;
    }
}, { immediate: true });

// Reset form ketika modal ditutup
watch(() => props.isOpen, (isOpen) => {
    if (!isOpen && !props.editMode) {
        resetForm();
    }
});

const resetForm = () => {
    newTask.title = ''
    newTask.description = ''
    newTask.category = ''
    newTask.categoryIcon = 'i-heroicons-tag'
    newTask.priority = 'medium'
    newTask.due_date = new Date().toISOString().slice(0, 10)
    newTask.completed = ''
}

const handleSubmit = () => {
    if (props.editMode && props.taskToEdit) {
        // Mode edit - update task yang sudah ada
        const updatedTask = {
            ...props.taskToEdit,
            title: newTask.title,
            description: newTask.description,
            category: newTask.category,
            categoryIcon: newTask.categoryIcon,
            priority: newTask.priority,
            due_date: newTask.due_date
        };
        console.log("Updated Task:", updatedTask);

        emit('update-task', updatedTask);
    } else {
        // Mode tambah - buat task baru
        console.log(newTask);

        emit('add-task', newTask);
    }

    // Reset form dan tutup modal
    resetForm();
    emit('close');
}

// Methods
const onCategoryInput = () => {
    showSuggestions.value = true
}

const hideSuggestions = () => {
    setTimeout(() => {
        showSuggestions.value = false
    }, 200)
}

const selectSuggestion = (suggestion) => {
    newTask.category = suggestion.name
    newTask.categoryIcon = suggestion.icon
    showSuggestions.value = false
}

const toggleIconOptions = () => {
    showIconOptions.value = !showIconOptions.value
}

const selectIcon = (iconValue) => {
    newTask.categoryIcon = iconValue
    showIconOptions.value = false
}

// Close icon options when clicking outside
onMounted(() => {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
            console.log("hidup jokowiii");
            showIconOptions.value = false
        }
    })
})

</script>

<template>
    <UModal :title="editMode ? 'Edit Task' : 'Add New Task'"
        :description="editMode ? 'Update task details' : 'Create a new task with title, priority, and due date'"
        :open="isOpen" :close="{ onClick: () => emit('close', false) }">
        <template #body class="p-6">
            <UForm :schema="taskSchema" :state="newTask" class="space-y-5" @submit="handleSubmit">
                <!-- Task Title Field -->
                <UFormField label="Task Title" name="title">
                    <UInput v-model="newTask.title" placeholder="Enter task title" icon="i-heroicons-pencil" size="lg"
                        class="w-full" />
                </UFormField>

                <!-- Task Description Field (New) -->
                <UFormField label="Description" name="description">
                    <UTextarea v-model="newTask.description" placeholder="Enter task description (optional)" size="lg"
                        class="w-full" :ui="{
                            base: 'min-h-[100px]'
                        }" />
                </UFormField>


                <!-- Category Field -->
                <UFormField label="Category" name="category">
                    <div class="flex space-x-2">
                        <div class="flex-grow relative">
                            <UInput v-model="newTask.category" placeholder="e.g., Work, Personal" size="lg"
                                class="w-full" @input="onCategoryInput" @focus="showSuggestions = true"
                                @blur="hideSuggestions" />
                            <!-- Category Suggestions -->
                            <div v-if="showSuggestions && filteredSuggestions.length > 0"
                                class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                <div v-for="suggestion in filteredSuggestions" :key="suggestion.name"
                                    class="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                    @mousedown.prevent="selectSuggestion(suggestion)">
                                    <UIcon :name="suggestion.icon" class="mr-2 text-gray-600 dark:text-gray-400" />
                                    <span class="text-gray-900 dark:text-white">{{ suggestion.name }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex-shrink-0 relative">
                            <!-- Icon Display Button -->
                            <button type="button"
                                class="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-800"
                                @click="toggleIconOptions">
                                <UIcon :name="selectedIcon" class="text-lg text-gray-600 dark:text-gray-400" />
                            </button>

                            <!-- Icon Options Dropdown -->
                            <div v-if="showIconOptions"
                                class="absolute z-20 top-full mt-1 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-2 grid grid-cols-4 gap-1 w-32">
                                <button v-for="icon in iconOptions" :key="icon.value" type="button"
                                    class="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                    :class="{
                                        'bg-primary-100 dark:bg-primary-800': selectedIcon === icon.value,
                                        'text-primary-600 dark:text-primary-400': selectedIcon === icon.value,
                                        'text-gray-600 dark:text-gray-400': selectedIcon !== icon.value
                                    }" @click="selectIcon(icon.value)">
                                    <UIcon :name="icon.value" class="text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                </UFormField>

                <!-- Priority Field - menggunakan USelect -->
                <UFormField label="Priority" name="priority">
                    <USelectMenu v-model="selectedPriority" :items="priorityItems" placeholder="Select priority"
                        size="lg" class="w-full" value-attribute="value">
                    </USelectMenu>
                </UFormField>

                <!-- Due Date Field -->
                <UFormField label="Due Date" name="dueDate">
                    <UInput type="date" v-model="newTask.due_date" icon="i-heroicons-calendar" size="lg"
                        class="w-full" />
                </UFormField>

                <div class="flex justify-end gap-2 mt-6">
                    <UButton variant="soft" color="gray" size="lg" @click="emit('close')">
                        Cancel
                    </UButton>
                    <UButton type="submit" color="primary" :icon="editMode ? 'i-heroicons-check' : 'i-heroicons-plus'"
                        size="lg">
                        {{ editMode ? 'Update Task' : 'Add Task' }}
                    </UButton>
                </div>
            </UForm>
        </template>
    </UModal>
</template>