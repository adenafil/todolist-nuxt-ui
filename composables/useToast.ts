export function useNotifications() {
  const toast = useToast(); // Dari nuxt/ui

  const showSuccessToast = (message: string) => {
    toast.add({
      title: "Success",
      description: message,
      color: "primary",
      icon: "i-heroicons-check-circle",
    });
  };

  return {
    showSuccessToast,
  };
}
