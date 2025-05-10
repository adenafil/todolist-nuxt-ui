export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const token = useCookie("sanctum.token.cookie").value;    

    return {
        provide: {
            api: (request: any, option: any) => {
                return useFetch(request, {
                    baseURL: config.public.sanctum.baseUrl,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": token ? `Bearer ${token}` : undefined,
                    },
                    cache: "force-cache",
                    ...(option || {})
                });
            }
        }
    };
});