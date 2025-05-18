<script setup lang="ts">
import { ref } from 'vue';

const isModalOpen = ref(false);
const isDeleting = ref(false);
const { showErrorToast, showSuccessToast } = useNotifications();
const router = useRouter();
const { $api } = useNuxtApp();
const { token } = useToken();


const openDeleteModal = () => {
    isModalOpen.value = true;
};

const closeDeleteModal = () => {
    isModalOpen.value = false;
};

const deleteAccount = async () => {
    try {
        isDeleting.value = true;
        await $api('/api/user/delete', {
          method: 'DELETE',
          headers: {
            Authorization: token.value
          }
        });

        showSuccessToast('Your account has been successfully deleted.');

        // just chill and grab some coffee before go out 
        setTimeout(() => {
            const { logout } = useSanctumAuth();
            logout();
            router.push('/');
        }, 1500);

    } catch (error) {
        showErrorToast('Failed to delete account. Please try again later.');
    } finally {
        isDeleting.value = false;
        closeDeleteModal();
    }
};
</script>

<template>
    <UCard class="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-medium text-red-700 dark:text-red-400">Delete Account</h3>
                <p class="text-sm text-red-600 dark:text-red-300">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
            </div>
            <UButton color="error" variant="soft" @click="openDeleteModal">
                Delete Account
            </UButton>
        </div>

        <!-- Delete Confirmation Modal -->
        <UModal :open="isModalOpen" @close="closeDeleteModal" size="sm">
            <template #header>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Confirm Account Deletion</h2>
            </template>
            <template #body>
                <div>
                    <div
                        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                        <UIcon name="i-heroicons-exclamation-triangle" class="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>

                    <div class="text-center">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Your Account</h3>
                        <div class="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p>
                                Are you sure you want to delete your account? All of your data will be permanently
                                removed.
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-center items-center text-center gap-3">
                        <UButton color="secondary" variant="soft" @click="closeDeleteModal" :disabled="isDeleting">
                            Cancel
                        </UButton>
                        <UButton color="error" variant="solid" @click="deleteAccount" :loading="isDeleting"
                            :disabled="isDeleting" trailing-icon="i-heroicons-trash">
                            Delete Account
                        </UButton>
                    </div>
                </div>

            </template>
        </UModal>
    </UCard>
</template>