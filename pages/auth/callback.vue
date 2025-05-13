<script setup lang="ts">
// Set page metadata
useSeoMeta({
    title: 'Logging In',
    ogTitle: 'Logging In',
    description: 'Completing your authentication process',
    ogDescription: 'Completing your authentication process',
    author: 'Ade Nafil Firmansah',
    keywords: 'task management, productivity, task tracker, to-do list, task organization, Ade Nafil Firmansah, Husni Mubarok, Achmad Wildan Muzaky',
})

// Define meta to disable navigation during authentication
definePageMeta({
    middleware: ['sanctum:guest'],
})

const token = useCookie('sanctum.token.cookie');

// Add a loading state
const isAuthenticating = ref(true)

// Router for redirection after auth completes
const route = useRoute();

// Automatically redirect to dashboard after a few seconds
// This simulates waiting for the auth callback to complete
onMounted(() => {
    setTimeout(() => {
        isAuthenticating.value = false
        token.value = typeof route.query.token === 'string' ? route.query.token : route.query.token?.[0] || null
        window.location.href = '/dashboard'
    }, 3000)
})
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950">
        <UCard class="w-full max-w-md shadow-xl border-0 text-center">
            <!-- App Logo -->
            <div class="mb-6 flex justify-center">
                <UIcon name="i-mdi:task-auto" class="text-primary-500 text-6xl" />
            </div>

            <h1 class="text-2xl font-bold mb-4">Authentication in progress</h1>

            <!-- Loading indicator -->
            <div class="flex flex-col items-center justify-center space-y-4">
                <UProgress animation="carousel" color="primary" :value="50" indeterminate class="w-48" />
                <p class="text-gray-600 dark:text-gray-300">
                    Please wait while we're logging you in...
                </p>
            </div>

            <!-- Auto-redirect message -->
            <p class="mt-6 text-sm text-gray-500">
                You'll be automatically redirected to your dashboard
            </p>

            <!-- Manual redirect option that appears after a delay -->
            <div v-if="!isAuthenticating" class="mt-4">
                <UButton to="/dashboard" color="primary">
                    Go to Dashboard
                </UButton>
            </div>
        </UCard>
    </div>
</template>