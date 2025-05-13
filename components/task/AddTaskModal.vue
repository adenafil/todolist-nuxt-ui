<script setup lang="ts">
import { z } from 'zod'

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
    }
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

// Tambahkan description field ke objek task
const newTask = reactive({
    title: '',
    description: '', // Tambahkan field deskripsi
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

// Jika dalam mode edit, isi form dengan data task yang akan diedit
watch(() => props.taskToEdit, (newVal) => {
    console.log(newVal);
    
    if (newVal && props.editMode) {
        newTask.title = newVal.title || '';
        newTask.description = newVal.description || '';
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
    newTask.title = '';
    newTask.description = '';
    newTask.priority = 'medium';
    newTask.due_date = new Date().toISOString().slice(0, 10);
    newTask.completed = '';
}

const handleSubmit = () => {
    if (props.editMode && props.taskToEdit) {
        // Mode edit - update task yang sudah ada
        const updatedTask = {
            ...props.taskToEdit,
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            due_date: newTask.due_date
        };
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
</script>

<template>
    <UModal :title="editMode ? 'Edit Task' : 'Add New Task'"
        :description="editMode ? 'Update task details' : 'Create a new task with title, priority, and due date'"
        :open="isOpen"
        :close="{ onClick: () => emit('close', false) }"

        >
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