<script setup>
import { useProfileForms } from '~/composables/profile/useProfileForms'

const { passwordData, passwordErrors, updatePassword } = useProfileForms()
</script>

<template>
    <UCard class="mb-6">
        <template #header>
            <div class="font-medium">Change Password</div>
        </template>

        <!-- Form -->
        <div class="space-y-6 px-1">
            <!-- Current Password -->
            <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Current Password
                </label>
                <UInput id="currentPassword" v-model="passwordData.currentPassword" type="password"
                    placeholder="Enter your current password"
                    :color="passwordErrors.currentPassword ? 'red' : undefined" class="w-full" size="lg" />
                <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ passwordErrors.currentPassword[0] }}
                </p>
            </div>

            <!-- New Password -->
            <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    New Password
                </label>
                <UInput id="newPassword" v-model="passwordData.newPassword" type="password"
                    placeholder="Enter new password" :color="passwordErrors.newPassword ? 'red' : undefined"
                    class="w-full" size="lg" />
                <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ passwordErrors.newPassword[0] }}
                </p>
            </div>

            <!-- Confirm Password -->
            <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Confirm New Password
                </label>
                <UInput id="confirmPassword" v-model="passwordData.confirmPassword" type="password"
                    placeholder="Confirm new password" :color="passwordErrors.confirmPassword ? 'red' : undefined"
                    class="w-full" size="lg" />
                <p v-if="passwordErrors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ passwordErrors.confirmPassword[0] }}
                </p>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-2">
                <UButton @click="updatePassword" color="primary" block>
                    Update Password
                </UButton>
            </div>
        </div>
    </UCard>
</template>