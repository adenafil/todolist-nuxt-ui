const cache = new Map();

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  return {
    provide: {
      api: async (request: string, options?: any) => {
        const cacheKey = JSON.stringify({ request, options });
        
        // Return cached response if available
        if (cache.has(cacheKey)) {
          return cache.get(cacheKey);
        }

        const response = await $fetch(request, {
          baseURL: config.public.sanctum.baseUrl,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          ...(options || {})
        });

        // Cache the response
        cache.set(cacheKey, response);
        return response;
      }
    }
  };
});