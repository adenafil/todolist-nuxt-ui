<script setup lang="ts">

definePageMeta({
    middleware: ['forgot-password'],
});

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const {showErrorToast, showSuccessToast} = useNotifications();

const password = ref('');
const confirmPassword = ref('');
const email = ref(route.query.email || '');
const formSubmitting = ref(false);
        
const passwordRules = [
    { required: true, message: 'Password is required' },
    { min: 8, message: 'Password must be at least 8 characters' },
];

const handleSubmit = async () => {
    if (password.value !== confirmPassword.value) {
        return;
    }

    formSubmitting.value = true;
    try {
        const response = await $fetch(`${config.public.sanctum.baseUrl}/api/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                token: route.query.token,
                email: route.query.email,
                password: password.value,
                password_confirmation: confirmPassword.value,
            },
        });

        showSuccessToast('Password reset successfully! You can now log in with your new password.');

        // Redirect to login page
        setTimeout(() => {
            router.push('/auth');
        }, 2000);

    } catch (e) {
        // Handle error
        showErrorToast('Failed to reset password. Please try again.');
    } finally {
        formSubmitting.value = false;
    }
};

// Set page metadata
useSeoMeta({
    title: 'Reset Password',
    ogTitle: 'Reset Password',
    description: 'Reset your password to regain access to your account.',
    ogDescription: 'Reset your password to regain access to your account.',
    author: 'Ade Nafil Firmansah',
    keywords: 'password reset, account recovery, security, taskify, taskify-pppl, Ade Nafil Firmansah, Husni Mubarok, Achmad Wildan Muzaky',
})
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950">
        <UCard class="w-full max-w-md shadow-lg border-0">
            <template #header>
                <div class="text-center">
                    <UIcon name="i-heroicons-lock-closed" class="h-16 w-16 text-primary mx-auto mb-4" />
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Reset Your Password</h1>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Please enter your new password below
                    </p>
                </div>
            </template>


            <form  @submit.prevent="handleSubmit" class="mt-6 space-y-6">
                <UFormField label="Email address" name="email">
                    <UInput v-model="email" type="email" placeholder="your@email.com" size="lg" readonly disabled
                        icon="i-heroicons-envelope" class="bg-gray-50 dark:bg-gray-800 w-full"  />
                </UFormField>

                <UFormField label="New Password" name="password">
                    <UInput v-model="password" type="password" placeholder="Enter new password" :rules="passwordRules" size="lg" class="w-full"
                        icon="i-heroicons-key" required />
                </UFormField>

                <UFormField label="Confirm Password" name="confirmPassword">
                    <UInput v-model="confirmPassword" type="password" placeholder="Confirm your new password" :rules="[
                        ...passwordRules,
                        { validator: () => password === confirmPassword, message: 'Passwords do not match' }
                    ]" icon="i-heroicons-key" size="lg" class="w-full" required />
                </UFormField>

                <div class="pt-2">
                    <UButton type="submit" block color="primary" size="lg" :loading="formSubmitting"
                        :disabled="formSubmitting || password !== confirmPassword || !password" class="shadow-sm">
                        <UIcon name="i-heroicons-check-circle" class="mr-1" />
                        Reset Password
                    </UButton>
                </div>

                <div class="text-center mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Remember your password?</p>
                    <UButton to="/auth" variant="ghost" color="gray" size="md" trailing-icon="i-heroicons-arrow-right">
                        Back to Login
                    </UButton>
                </div>
            </form>

            <template #footer>
                <div class="text-center text-xs text-gray-500 dark:text-gray-400">
                    <p>© 2025 Taskify. Secure password reset.</p>
                </div>
            </template>
        </UCard>
    </div>
</template>