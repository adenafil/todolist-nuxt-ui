<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

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
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-5 px-3" @submit="onSubmit">
    <UFormField label="Email address" name="email">
      <UInput v-model="state.email" size="lg" class="w-full" icon="i-heroicons-envelope" placeholder="your@email.com" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" size="lg" class="w-full" icon="i-heroicons-lock-closed" placeholder="••••••••" />
    </UFormField>
    
    <UFormField label="Confirm Password" name="confirmPassword">
      <UInput v-model="state.confirmPassword" type="password" size="lg" class="w-full" icon="i-heroicons-lock-closed" placeholder="••••••••" />
    </UFormField>

    <UButton type="submit" block size="lg" color="primary" class="mt-2">
      Create Account
    </UButton>
  </UForm>
</template>