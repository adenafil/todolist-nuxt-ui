export function useToken() {
    const token = useCookie("sanctum.token.cookie");
    const config = useRuntimeConfig();
    
    // Create computed property that will update when the cookie changes
    const tokenValue = computed(() => token.value ? `Bearer ${token.value}` : undefined);
    
    return {
        token: tokenValue,
        config,
    };
} 