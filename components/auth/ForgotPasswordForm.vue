<script setup lang="ts">

const { showErrorToast, showSuccessToast} = useNotifications();
const config = useRuntimeConfig();

const props = defineProps({
  schema: {
    type: Object,
    required: true
  },
  state: {
    type: Object,
    required: true
  },
  onSubmit: {
    type: Function,
    required: true
  }
})

const isLoading = ref(false);

const resetHandler = async () => {
  try {
    isLoading.value = true;
    const response = await $fetch(`${config.public.sanctum.baseUrl}/api/forgot-password`, {
      method: 'POST',
      body: {
        email: props.state.email,
      },
    })

    if (response.status === "success") {
      showSuccessToast('Password reset link sent to your email address.')
    } else {
      showErrorToast('Failed to send password reset link. Please try again.')
    }

  } catch (e) {
    showErrorToast('Failed to send password reset link. Please try again.')
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-5 px-3" @submit="resetHandler" :loading-auto="isLoading">
    <UFormField label="Email address" name="email">
      <UInput v-model="state.email" size="lg" class="w-full" icon="i-heroicons-envelope" placeholder="your@email.com" />
    </UFormField>

    <UButton type="submit" block size="lg" :loading="isLoading" color="primary" class="mt-6">
      Reset Password
    </UButton>
  </UForm>
</template>