<script setup lang="ts">

useSeoMeta({
    title: 'Authentication Error',
    ogTitle: 'Authentication Error',
    description: 'An error occurred during the authentication process',
    ogDescription: 'An error occurred during the authentication process',
    author: 'Ade Nafil Firmansah',
    keywords: 'task management, productivity, task tracker, to-do list, task organization, Ade Nafil Firmansah, Husni Mubarok, Achmad Wildan Muzaky',
})

const route = useRoute();

const message = route.query.message || 'An unknown error occurred. Please try again later.';


onMounted(() => {
    // Redirect to the login page after a delay
    setTimeout(() => {
        window.location.href = '/auth';
    }, 3000); // 5 seconds delay
});

</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950">
        <UCard class="w-full max-w-md shadow-xl border-0 text-center">
            <!-- App Logo -->
            <div class="mb-6 flex justify-center">
                <UIcon name="i-mdi:task-auto" class="text-primary-500 text-6xl" />
            </div>

            <h1 class="text-2xl font-bold mb-4">Authentication Error</h1>

            <!-- Error message -->
            <div class="flex flex-col items-center justify-center space-y-4">
                <p class="text-gray-600 dark:text-gray-300">
                    {{ message }}
                </p>
            </div>

            <!-- Manual redirect option that appears after a delay -->
            <div class="mt-4">
                <UButton to="/auth" color="primary">
                    Go to Login
                </UButton>
            </div>
        </UCard>
    </div>
</template>