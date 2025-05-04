<template>
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
      color="neutral" 
      variant="soft"
      class="px-8 block"
    >
      Login
    </UButton>
  </div>
</template>