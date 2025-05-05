import { ref, watch } from "vue";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Create a ref to hold the data
  const data = ref<T>(defaultValue);

  // Try to get the value from localStorage
  onMounted(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) data.value = JSON.parse(value);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  });

  // Watch for changes and update localStorage
  watch(
    data,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    { deep: true }
  );

  return data;
}
