// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: process.env.SITE_NAME || "Taskify",
      titleTemplate: `%s | ${process.env.SITE_NAME || "Taskify"}`,
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "google-site-verification",
          content: "T4Zj4_gH0aIjm-hCMB9d1Z7Xj4ksSSR5uoeT9Nead_o",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "page", mode: "out-in" },
  },

  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-auth-sanctum", "@nuxtjs/seo", "nuxt-vue3-google-signin"],
  googleSignIn: {
    clientId: "524928128882-qf2p7f365ftmpj7mngm2n96lie45u8g7.apps.googleusercontent.com",
  },

  css: ["@/assets/css/main.css"],

  // Add SSR configuration
  ssr: true,

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      SITE_NAME: process.env.SITE_NAME || "Taskify",
    },
  },

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
    baseUrl: process.env.API_URL, // Laravel San 🥰 API
    origin: process.env.SITE_NAME, // Nuxt Chan 😍app
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
