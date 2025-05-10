<script setup lang="ts">
// Use the shared auth state directly
const formType = useState<string>("authFormType", () => "login");

const setFormType = (type: string) => {
  formType.value = type;
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 justify-center">
    <UButton to="/auth" size="xl" color="primary" class="px-8 block" @click="setFormType('register')">
      Create Account
    </UButton>

    <UButton to="/auth" size="xl" color="neutral" variant="soft" class="px-8 block" @click="setFormType('login')">
      Login
    </UButton>
  </div>
</template>