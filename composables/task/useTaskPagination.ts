// composables/task/useTaskPagination.ts
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useNuxtApp } from "#app";
import type { Task } from "~/types/task";

export function useTaskPagination(filteredTasks: Ref<Task[]>) {
  const { $isHydrating } = useNuxtApp();
  const isHydrating = ref(true);
  const currentPage = ref(1);
  const itemsPerPage = ref(5);

  // Combine both hydration flags for extra safety
  const isCurrentlyHydrating = computed(() => {
    return isHydrating.value || ($isHydrating && $isHydrating.value);
  });

  // Improve watch to handle hydration state
  watch(
    filteredTasks,
    () => {
      if (isCurrentlyHydrating.value) return;

      console.log("Filtered tasks changed, checking pagination");
      // If we're not on the first page and there are no items on the current page
      // (due to deletion or filtering), reset to page 1
      if (filteredTasks.value.length > 0 && (currentPage.value - 1) * itemsPerPage.value >= filteredTasks.value.length) {
        console.log("Resetting to page 1 due to filter change");
        currentPage.value = 1;
      }

      // If a new task was added and we're on page 1, ensure we stay there to see it
      if (filteredTasks.value.length > 0 && currentPage.value === 1) {
        // Force a re-render of paginated tasks
        nextTick(() => {
          // This triggers the computed to re-evaluate
          currentPage.value = 1;
        });
      }
    },
    { immediate: true, deep: true } // Add deep watching to catch array mutations
  );

  // Modify computed property to handle hydration state
  const paginatedTasks = computed(() => {
    // During hydration, return empty array to match server
    if (isCurrentlyHydrating.value) {
      return [];
    }

    // Memaksa computed property untuk bereaksi terhadap perubahan
    const page = currentPage.value;
    const perPage = itemsPerPage.value;
    const allTasks = filteredTasks.value;

    console.log(`Calculating pagination for page ${page}, items per page: ${perPage}`);

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    console.log(`Slicing from ${startIndex} to ${endIndex}, total items: ${allTasks.length}`);

    // Slice dari fresh copy array untuk memastikan reaktivitas
    return [...allTasks].slice(startIndex, endIndex);
  });

  // Mark hydration as complete once mounted
  onMounted(() => {
    nextTick(() => {
      isHydrating.value = false;
    });
  });

  // Watch page changes for debugging
  watch(currentPage, (newPage) => {
    console.log("Page changed to:", newPage);
  });

  // Update items per page dan reset ke halaman pertama
  const setItemsPerPage = (count: number) => {
    itemsPerPage.value = count;
    currentPage.value = 1;
  };

  // Perbaikan: Fungsi setPage yang lebih robust
  const setPage = (page: number) => {
    console.log("Setting page to:", page);

    // Gunakan nextTick untuk memastikan DOM diperbarui
    nextTick(() => {
      currentPage.value = page;
      console.log("Current page after update:", currentPage.value);
      console.log("Current paginated tasks:", paginatedTasks.value);
    });
  };

  return {
    currentPage,
    itemsPerPage,
    paginatedTasks,
    setItemsPerPage,
    setPage,
  };
}
