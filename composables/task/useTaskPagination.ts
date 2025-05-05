// composables/task/useTaskPagination.ts
import { ref, computed, watch, nextTick } from "vue";
import type { Task } from "~/types/task";

export function useTaskPagination(filteredTasks: Ref<Task[]>) {
  const currentPage = ref(1);
  const itemsPerPage = ref(5);

  // Perbaikan: Force immediate watch untuk reset pagination
  watch(
    filteredTasks,
    () => {
      console.log("Filtered tasks changed, checking pagination");
      if (filteredTasks.value.length > 0 && (currentPage.value - 1) * itemsPerPage.value >= filteredTasks.value.length) {
        console.log("Resetting to page 1 due to filter change");
        currentPage.value = 1;
      }
    },
    { immediate: true }
  );

  // Perbaikan: Memaksa pembaruan paginatedTasks dengan dependensi yang eksplisit
  const paginatedTasks = computed(() => {
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
