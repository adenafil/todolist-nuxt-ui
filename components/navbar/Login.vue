<script setup lang="ts">
import { toast } from '#build/ui'
import { z } from 'zod'
import { useRouteQuery } from '~/composables/useRouteQuery'

const emit = defineEmits(['search'])
const router = useRouter()
const route = useRoute()

// Use the shared state
const { searchTerm, setSearchTerm } = useSearchState()

const state = reactive({
    search: ''
})

const { updateSearch } = useRouteQuery()

const searchTasks = () => {
    if (state.search.trim()) {
        // Update the shared state
        setSearchTerm(state.search)

        // Update URL query parameter
        updateSearch(state.search)

        emit('search', state.search)

        // Navigate to dashboard if we're not already there
        if (route.path !== '/dashboard') {
            router.push({
                path: '/dashboard',
                query: { search: state.search }
            })
        }

        console.log('Searching for:', state.search)
    }
}

const user = useState('sanctum.user.identity').value.data;


const { logout } = useSanctumAuth();


// Fungsi handler untuk logout
const handleLogout = async () => {
    console.log('Logging out...')
    // Implementasi logout sebenarnya akan ditambahkan di sini

    await logout();

    // if (status.value === 200) {
    //     // Redirect to login page or perform any other action
    //     router.push('/auth')
    // } else {
    //     // Handle error
    //     // toast.error('Logout failed. Please try again.')
    //     console.error('Logout error:', error.value)
    // }
}

// Definisikan dropdown items dengan struktur yang benar
const dropdownItems = [
    { label: 'Dashboard', icon: 'i-heroicons-home', to: '/dashboard' }, // Tambahkan Dashboard
    { label: 'Profile', icon: 'i-heroicons-user', to: '/profile' },
    { divider: true }, // Tambahkan divider
    { label: 'Logout', icon: 'i-heroicons-arrow-right-on-rectangle', onSelect: handleLogout }
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

// Update clear search functionality
const clearSearch = () => {
    state.search = ''
    emit('search', '')
    setSearchTerm('')
    updateSearch('')  // Clear the URL parameter
}

// Make sure the search input reflects the current search term
onMounted(() => {
    state.search = searchTerm.value || ''
})
</script>

<template>
    <header class="flex items-center justify-between lg:px-20 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <!-- Logo & Brand -->
        <div class="flex items-center cursor-pointer" @click="navigateTo('/dashboard')">
            <UIcon name="i-mdi:task-auto" class="text-primary text-4xl mr-2" />
            <h1 class="text-xl font-bold text-gray-800 dark:text-white">Taskify</h1>
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
            <UDropdownMenu :items="dropdownItems" :content="{
                align: 'center',
                side: 'top'

            }" :popper="{ placement: 'bottom-end' }">
                <UAvatar :src="user.avatar" :alt="user.name" size="xl" class="cursor-pointer" />

                <!-- Informasi profil di dalam dropdown -->
                <template #content-top>
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