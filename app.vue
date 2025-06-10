<script setup>
onMounted(() => {
  if (process.client && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration)
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
  }
})

</script>

<template>
  <NuxtLoadingIndicator :throttle="0" :height="2" :duration="4000" />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
