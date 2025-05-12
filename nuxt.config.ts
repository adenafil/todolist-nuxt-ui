// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: process.env.SITE_NAME || "Taskify",
      titleTemplate: `%s | ${process.env.SITE_NAME || "Taskify"}`,
      htmlAttrs: {
        lang: "en",
      }
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
  },

  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-auth-sanctum", "@nuxtjs/seo"],
  css: ["@/assets/css/main.css"],

  // Add SSR configuration
  ssr: true,

  experimental: {
    asyncContext: true,
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