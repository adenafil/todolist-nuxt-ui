<!-- components/profile/DeleteAccountCard.vue -->
<template>
    <UCard class="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-medium text-red-700 dark:text-red-400">Delete Account</h3>
                <p class="text-sm text-red-600 dark:text-red-300">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
            </div>
            <UButton color="error" variant="soft">
                Delete Account
            </UButton>
        </div>
    </UCard>
</template>