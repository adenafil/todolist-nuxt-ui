<script setup lang="ts">
defineProps({
    searchTerm: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['clear-search'])
const { user } = useUser();


const clearSearch = () => {
    emit('clear-search')
}
</script>

<template>
    <div class="mb-6">
        <h1 class="text-2xl font-bold mb-1 text-gray-800 dark:text-white">Welcome Back {{ user.name }}👋</h1>
        <p class="text-gray-500 dark:text-gray-400">Ready to start your activity now!</p>

        <!-- Active search notification -->
        <div v-if="searchTerm"
            class="mt-2 p-2 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200 rounded-md flex items-center">
            <UIcon name="i-heroicons-magnifying-glass" class="mr-2" />
            <span>Showing results for: <strong>{{ searchTerm }}</strong></span>
            <UButton icon="i-heroicons-x-mark" variant="ghost" color="neutral" size="xs" class="ml-auto"
                @click="clearSearch" />
        </div>
    </div>
</template>