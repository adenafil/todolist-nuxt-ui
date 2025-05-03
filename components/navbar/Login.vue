<script setup lang="ts">
import { z } from 'zod'

const emit = defineEmits(['search'])
const { $bus } = useNuxtApp() // Tambahkan akses ke event bus

const state = reactive({
    search: ''
})

const searchTasks = () => {
    if (state.search.trim()) {
        // Emit ke parent dan juga langsung ke event bus
        emit('search', state.search)
        $bus.emit('search', state.search) // Emit langsung ke event bus
        console.log('Searching for:', state.search)
    }
}

// Gunakan user store atau composable untuk data pengguna
const user = {
    name: 'Gus Husni Mubarok Duduk',
    email: 'husni@example.com', // Tambahkan email
    avatar: 'https://avatars.githubusercontent.com/u/151940728?v=4'
}

// Fungsi handler untuk logout
const handleLogout = () => {
    console.log('Logging out...')
    // Implementasi logout sebenarnya akan ditambahkan di sini
}

// Definisikan dropdown items dengan struktur yang benar
const dropdownItems = [
    { label: 'Dashboard', icon: 'i-heroicons-home', to: '/dashboard' }, // Tambahkan Dashboard
    { label: 'Profile', icon: 'i-heroicons-user', to: '/profile' },
    { divider: true }, // Tambahkan divider
    { label: 'Logout', icon: 'i-heroicons-arrow-right-on-rectangle', click: handleLogout }
]

const schema = z.object({
    search: z.string().min(1, 'Search term is required')
})

const handleSearchChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    state.search = input.value
    console.log('Search term changed:', state.search);
    searchTasks()
}

const handleSearchSubmit = () => {
    if (schema.safeParse({ search: state.search }).success) {
        searchTasks()
    } else {
        console.log('Search term is invalid')
    }
}

// Tambahkan clear search functionality
const clearSearch = () => {
    state.search = ''
    emit('search', '') // Reset search results
    $bus.emit('search', '') // Reset search results via event bus
}
</script>

<template>
    <header class="flex items-center justify-around p-4 bg-white dark:bg-gray-800 shadow-sm">
        <!-- Logo & Brand -->
        <div class="flex items-center cursor-pointer" @click="navigateTo('/dashboard')">
            <UIcon name="i-heroicons-check-circle" class="text-primary text-2xl mr-2" />
            <h1 class="text-xl font-bold text-gray-800 dark:text-white">TaskManager</h1>
        </div>

        <!-- Search & User Profile -->
        <div class="flex items-center gap-4">
            <!-- Search Form -->
            <UForm :schema="schema" :state="state" class="relative" @submit.prevent="handleSearchSubmit">
                <UInput v-model="state.search" size="lg" icon="i-heroicons-magnifying-glass"
                    placeholder="Search tasks..." class="md:w-64 w-40" @keyup.enter="searchTasks"
                    @keyup="handleSearchChange">
                    <template #trailing>
                        <div class="flex">
                            <UButton v-if="state.search" icon="i-heroicons-x-mark" color="secondary" variant="ghost"
                                size="xs" @click="clearSearch" aria-label="Clear search" />
                            <UButton icon="i-heroicons-magnifying-glass" color="primary" variant="ghost" size="xs"
                                @click="searchTasks" aria-label="Search" />
                        </div>
                    </template>
                </UInput>
            </UForm>

            <!-- User Menu -->
            <UDropdownMenu :items="dropdownItems" :popper="{ placement: 'bottom-end' }">
                <UAvatar :src="user.avatar" :alt="user.name" size="xl" class="cursor-pointer" />
                
                <!-- Informasi profil di dalam dropdown -->
                <template #before>
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center gap-3 mb-2">
                            <UAvatar :src="user.avatar" :alt="user.name" size="sm" />
                            <div>
                                <div class="font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </UDropdownMenu>
        </div>
    </header>
</template>