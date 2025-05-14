<script setup>

</script>

<template>
  <NuxtLoadingIndicator :throttle="0" :height="2" :duration="4000" />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
