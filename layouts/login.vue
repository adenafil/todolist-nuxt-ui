<script setup lang="ts">
// Persistent state jika diperlukan
const isDarkMode = ref(false)

// Toggle dark mode
const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    document.documentElement.classList.toggle('dark', isDarkMode.value)
}

// Deteksi preferensi tema sistem pada awal load
onMounted(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDarkMode.value = true
        document.documentElement.classList.add('dark')
    }
})

const emit = defineEmits(['search'])

const handleSearch = (searchTerm) => {
  emit('search', searchTerm)
}
</script>

<template>
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <!-- Navbar/Header -->
        <NavbarLogin @search="handleSearch" />

        <!-- Main Content Area -->
        <main class="flex-1 p-6 max-w-7xl mx-auto w-full">
            <!-- Slot untuk konten halaman -->
            <slot />
        </main>

        <!-- Footer -->
        <footer class="py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div
                class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div>
                    <p>© 2025 Taskify. All rights reserved.</p>
                </div>
                <div class="flex space-x-4 mt-3 md:mt-0">
                    <UButton icon="i-heroicons-moon" v-if="!isDarkMode" color="secondary" variant="ghost" size="xs"
                        @click="toggleDarkMode" />
                    <UButton icon="i-heroicons-sun" v-else color="secondary" variant="ghost" size="xs"
                        @click="toggleDarkMode" />
                    <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
                    <a href="#" class="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
                </div>
            </div>
        </footer>
    </div>
</template>