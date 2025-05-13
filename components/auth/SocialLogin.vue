<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
</script>

<template>
  <div class="relative my-6">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
    </div>
    <div class="relative flex justify-center text-sm">
      <span class="px-2 bg-white dark:bg-gray-900 text-gray-500">
        Or continue with
      </span>
    </div>
  </div>
  
  <div class="grid grid-cols-2 gap-3 mb-4">
    <UButton :href="`${runtimeConfig.public.API_URL}/login/google`" color="neutral" variant="outline" block icon="i-simple-icons-google">
      Google
    </UButton>
    <UButton color="neutral" variant="outline" block icon="i-simple-icons-github">
      GitHub
    </UButton>
  </div>
</template>