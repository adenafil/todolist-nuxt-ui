import { ref, watch } from "vue";

export function useDebounce<T>(value: Ref<T>, delay: number = 300) {
  const debouncedValue = ref(value.value) as Ref<T>;
  const timeout = ref<NodeJS.Timeout | null>(null);

  watch(value, (newValue) => {
    if (timeout.value) clearTimeout(timeout.value);

    timeout.value = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delay);
  });

  onBeforeUnmount(() => {
    if (timeout.value) clearTimeout(timeout.value);
  });

  return debouncedValue;
}
