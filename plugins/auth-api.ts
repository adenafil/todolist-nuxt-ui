export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const { token } = useToken();    

    console.log(nuxtApp);
    

    return {
        provide: {
            api: (request: any, option: any) => {
                return useFetch(request, {
                    baseURL: config.public.sanctum.baseUrl,
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    cache: "default",
                    ...(option || {})
                });
            }
        }
    };
});