// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-auth-sanctum"],
  css: ["@/assets/css/main.css"],

  // Add SSR configuration
  ssr: true,

  // Add experimental features for better hydration
  experimental: {
    // This helps with hydration by skipping some reactivity transforms
    asyncContext: true,
    // Improve hydration performance
    payloadExtraction: true,
  },

  vite: {
    server: {
      allowedHosts: true,
    },
  },
  sanctum: {
    mode: "token",
    redirectIfAuthenticated: true,
    redirectIfUnauthenticated: true,
    baseUrl: "http://localhost:8000", // Laravel API
    endpoints: {
      csrf: "/sanctum/csrf-cookie",
      login: "/api/login",
      logout: "/api/logout",
      user: "/api/user",
    },
    redirect: {
      onLogin: "/dashboard", // Custom route after successful login
      onLogout: "/auth",
      onAuthOnly: "/auth",
      onGuestOnly: "/dashboard",
    },
    csrf: {
      header: "X-XSRF-TOKEN",
    },
    userStateKey: "sanctum.user.identity",
    appendPlugin: true,
  },
});
