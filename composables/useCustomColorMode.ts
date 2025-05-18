import { useColorMode } from "#imports";

export function useCustomColorMode() {
  // Gunakan composable bawaan Nuxt UI
  const colorMode = useColorMode();

  // Toggle dark mode function
  const toggleDarkMode = () => {
    colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
  };

  // Set initial mode berdasarkan preferensi sistem
  const initColorMode = () => {
    if (process.client) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark && !colorMode.preference) {
        colorMode.preference = "dark";
      }
    }
  };

  return {
    isDark: computed(() => colorMode.preference === "dark"),
    toggleDarkMode,
    setColorMode: (mode: "dark" | "light") => {
      colorMode.preference = mode;
    },
    initColorMode,
  };
}
