export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log(to);
  const config = useRuntimeConfig();
  const { showErrorToast } = useNotifications();

  if (!to.query.email || !to.query.token) {
    console.log(!to.query.email && !to.query.token);

    return navigateTo({
      path: "/auth",
    });
  }

  try {
    const response = await $fetch(`${config.public.sanctum.baseUrl}/api/is-token-valid`, {
      method: "POST",
      body: {
        email: to.query.email,
        token: to.query.token,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    

  } catch (error) {
    console.error("Error validating token:", error);
    showErrorToast("Token is invalid or expired");
    return navigateTo({
      path: "/auth",
      query: { error: "your email or token is invalid or expired" },
    });
  }
});
