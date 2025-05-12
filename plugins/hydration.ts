export default defineNuxtPlugin((nuxtApp) => {
  const isHydrating = ref(true);

  nuxtApp.hook("app:mounted", () => {
    // Wait until the next tick after app is mounted to ensure hydration is complete
    nextTick(() => {
      isHydrating.value = false;
      console.log("Hydration completed");
    });
  });

  return {
    provide: {
      isHydrating,
    },
  };
});
