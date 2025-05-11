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


  const showErrorToast = (message: string) => {
    toast.add({
      title: "Failed",
      description: message,
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  }

  return {
    showSuccessToast,
    showErrorToast,
  };
}
