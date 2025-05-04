<script setup lang="ts">
const { icon, title, description } = defineProps({
    icon: {
        type: String,
        default: 'i-mdi:task-auto'
    },
    title: {
        type: String,
        default: 'Taskify'
    },
    description: {
        type: String,
        default: 'Streamline your productivity with our intuitive task management application. Organize, prioritize, and complete your tasks efficiently.'
    }
})
</script>

<template>
    <!-- App Logo -->
    <div class="mb-8 flex justify-center">
        <UIcon :name="icon" class="text-primary-500 text-6xl" />
    </div>

    <!-- App Title -->
    <h1 class="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        {{ title }}
    </h1>

    <!-- App Description -->
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        {{ description }}
    </p>


</template>