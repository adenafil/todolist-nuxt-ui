<template>
    <div class="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div class="max-w-3xl w-full text-center">
            <!-- App Logo -->
            <div class="mb-8 flex justify-center">
                <UIcon name="i-heroicons-check-circle" class="text-primary-500 text-6xl" />
            </div>
            
            <!-- App Title -->
            <h1 class="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Task Manager
            </h1>
            
            <!-- App Description -->
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Streamline your productivity with our intuitive task management application. 
                Organize, prioritize, and complete your tasks efficiently.
            </p>
            
            <!-- Features List -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <UIcon name="i-heroicons-list-bullet" class="text-3xl text-primary-500 mb-3 mx-auto" />
                    <h3 class="text-lg font-semibold mb-2">Organize Tasks</h3>
                    <p class="text-gray-600 dark:text-gray-400">Keep track of all your tasks in one place</p>
                </div>
                
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <UIcon name="i-heroicons-bell-alert" class="text-3xl text-primary-500 mb-3 mx-auto" />
                    <h3 class="text-lg font-semibold mb-2">Set Reminders</h3>
                    <p class="text-gray-600 dark:text-gray-400">Never miss important deadlines again</p>
                </div>
                
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <UIcon name="i-heroicons-chart-bar" class="text-3xl text-primary-500 mb-3 mx-auto" />
                    <h3 class="text-lg font-semibold mb-2">Track Progress</h3>
                    <p class="text-gray-600 dark:text-gray-400">Monitor your productivity and achievements</p>
                </div>
            </div>
            
            <!-- Auth Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <UButton 
                    to="/auth?mode=register" 
                    size="xl" 
                    color="primary"
                    class="px-8 block"
                >
                    Create Account
                </UButton>
                
                <UButton 
                    to="/auth?mode=login" 
                    size="xl" 
                    color="gray" 
                    variant="soft"
                    class="px-8 block"
                >
                    Login
                </UButton>
            </div>
            
            <!-- Small Footer -->
            <p class="mt-12 text-sm text-gray-500 dark:text-gray-400">
                Already using Task Manager on another device? 
                <UButton to="/auth?mode=login" variant="link" color="primary" class="px-0">
                    Sign in now
                </UButton>
            </p>
        </div>
    </div>
</template>