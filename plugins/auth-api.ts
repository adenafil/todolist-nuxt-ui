const cache = new Map();

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const route = useRoute();
  // set color mode to be bro my men 😎 🎶 not like us played dawg
  const colorMode = useColorMode()
  colorMode.preference = 'dark'
  

  // Function to clear specific cache entries
  const clearCache = (pattern?: string | RegExp) => {
    if (!pattern) {
      // Clear entire cache
      cache.clear();
      return;
    }

    if (typeof pattern === "string") {
      // Clear a specific cache key
      cache.delete(pattern);
    } else {
      // Clear all cache keys matching the pattern
      for (const key of Array.from(cache.keys())) {
        if (pattern.test(key)) {
          cache.delete(key);
        }
      }
    }
  };

  return {
    provide: {
      api: async (request: string, options?: any) => {
        // Only cache GET requests
        const isGet = !options?.method || options.method === "GET";

        // Include current route path in cache key
        const routePath = route.path;
        const cacheKey = JSON.stringify({ request, options, routePath });

        // Skip cache for non-GET requests or if explicitly requested
        const skipCache = !isGet || options?.skipCache === true;

        // Return cached response if available and not skipping cache
        if (!skipCache && cache.has(cacheKey)) {
          const cachedData = cache.get(cacheKey);
          // Check if cache has expired
          if (cachedData._expiresAt && cachedData._expiresAt > Date.now()) {
            // Return a clone of the cached data to prevent mutation
            return JSON.parse(JSON.stringify(cachedData.data));
          } else {
            // Expired cache, remove it
            cache.delete(cacheKey);
          }
        }

        // Fetch fresh data
        const response = await $fetch(request, {
          baseURL: config.public.sanctum.baseUrl,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          ...(options || {}),
        });

        // Only cache GET requests
        if (isGet) {
          // Calculate expiration (5 minutes by default, configurable via options)
          const cacheLifetime = options?.cacheLifetime || 5 * 60 * 1000; // 5 minutes
          const expiresAt = Date.now() + cacheLifetime;

          // Store response with expiration
          cache.set(cacheKey, {
            data: response,
            _expiresAt: expiresAt,
          });
        } else {
          // For non-GET requests, invalidate related cache entries
          clearCache(new RegExp(request));
        }

        return response;
      },
      clearApiCache: clearCache,
    },
  };
});
