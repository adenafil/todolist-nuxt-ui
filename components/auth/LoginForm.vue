<script setup lang="ts">

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
    type: Function as PropType<(event: any) => void | Promise<void>>,
    required: true
  }
})

const emit = defineEmits(['navigate'])

const navigateToForgotPassword = () => {
  emit('navigate', 'forgotPassword')
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-5 px-3" @submit="onSubmit">
    <UFormField label="Email address" name="email">
      <UInput v-model="state.email" size="lg" class="w-full" icon="i-heroicons-envelope" placeholder="your@email.com" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" size="lg" class="w-full" icon="i-heroicons-lock-closed" placeholder="••••••••" />
    </UFormField>
    
    <div class="text-right">
      <UButton variant="link" color="primary" size="sm" @click="navigateToForgotPassword">Forgot password?</UButton>
    </div>

    <UButton type="submit" block size="lg" color="primary" class="mt-2">
      Sign in
    </UButton>
  </UForm>
</template>