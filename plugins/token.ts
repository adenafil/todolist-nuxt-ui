export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const tokenCookie = useCookie("sanctum.token.cookie");
    
    // Create computed property that will update when the cookie changes
    const token = computed(() => tokenCookie.value ? `Bearer ${tokenCookie.value}` : undefined);


    return {
        provide: {
            token: token,
        }
    };
});