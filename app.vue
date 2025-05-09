<script setup>
// set color mode to be bro my men 😎 🎶 not like us played dawg
const colorMode = useColorMode()
colorMode.preference = 'dark'

</script>

<template>
  <NuxtLoadingIndicator :throttle="0" :height="2" :duration="4000" />
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
