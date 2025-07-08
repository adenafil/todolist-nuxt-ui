<template>
    <!-- Small Footer -->
    <p class="mt-12 text-sm text-gray-500 dark:text-gray-400">
        Already using Taskify on another device?
        <UButton to="/auth?mode=login" variant="link" color="primary" class="px-0">
            Sign in now
        </UButton>
    </p>
    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        &copy; {{ new Date().getFullYear() }} Taskify. All rights reserved.
    </p>
</template>