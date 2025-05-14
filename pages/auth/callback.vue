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
    // Remove sanctum:guest middleware - we don't want middleware to run during token processing
    middleware: [],
})

const token = useCookie('sanctum.token.cookie', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax'
});

// Add a loading state
const isAuthenticating = ref(true)
const authError = ref(false)

// Router for redirection after auth completes
const router = useRouter()
const route = useRoute();

// Process the token immediately on component creation
const processToken = async () => {
    try {
        // Set the token
        const tokenValue = typeof route.query.token === 'string'
            ? route.query.token
            : route.query.token?.[0] || null

        if (!tokenValue) {
            authError.value = true
            router.push('/login?error=no_token')
            return
        }

        // Set the token
        token.value = tokenValue

        // Add a longer delay to ensure the cookie is set and processed
        await new Promise(resolve => setTimeout(resolve, 300))

        // Force localStorage to also keep a copy
        localStorage.setItem('auth_token', tokenValue)

        // Force a reload instead of router navigation
        // This is the most reliable way to ensure middleware picks up the new auth state
        window.location.href = '/dashboard'
    } catch (error) {
        console.error('Authentication error:', error)
        authError.value = true
    } finally {
        isAuthenticating.value = false
    }
}

console.log(route.query);


// Run this as soon as the component mounts
onMounted(() => {
    // Small delay for UX
    setTimeout(processToken, 1000)
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