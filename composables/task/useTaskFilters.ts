import { ref, computed, watch, onMounted, nextTick } from "vue";
import type { Task, TaskFilter, TaskStats } from "~/types/task";
import { useTasks } from "~/composables/task/useTasks";

export function useTaskFilters(tasks: Ref<Task[]>, externalSearchTerm?: Ref<string>) {
  // Add isHydrating flag
  const isHydrating = ref(true);
  const { fetchTasks, isLoading } = useTasks();

  // Use the external search term if provided, otherwise create a local one
  const searchTerm = externalSearchTerm || ref("");
  const activeFilter = ref<TaskFilter>("all");
  const sortOrder = ref("date-asc");

  // Convert app filter to API filter
  const mapFilterToApiStatus = (filter: TaskFilter): string => {
    switch (filter) {
      case "in-progress":
        return "in_progress";
      case "completed":
        return "completed";
      case "expired":
        return "expired";
      default:
        return "all";
    }
  };

  // Task counts for filter tabs - now based on API data
  // Modify the computed to handle SSR/hydration state
  const taskCounts = computed<TaskStats>(() => {
    // During hydration on client side, return empty counts to match server
        
    if (process.client && isHydrating.value) {
      return {
        all: 0,
        inProgress: 0,
        completed: 0,
        expired: 0,
        priorityHigh: 0,
        priorityMedium: 0,
        priorityLow: 0,
      };
    }
    
    return {
      all: tasks.value.length,
      inProgress: tasks.value.filter((t) => t.status === "in_progress").length,
      completed: tasks.value.filter((t) => t.status === "completed").length,
      expired: tasks.value.filter((t) => t.status === "expired").length,
      priorityHigh: tasks.value.filter((t) => t.priority === "high").length,
      priorityMedium: tasks.value.filter((t) => t.priority === "medium").length,
      priorityLow: tasks.value.filter((t) => t.priority === "low").length,
    };
  });

  // Apply filters through API - ensure this updates when tasks change
  const applyFilters = async () => {
    if (isLoading.value) return; // Prevent duplicate calls during loading

    const params: Record<string, string> = {};

    // Add status filter if not "all"
    if (activeFilter.value !== "all" && !activeFilter.value.startsWith("priority-")) {
      params.status = mapFilterToApiStatus(activeFilter.value);
    }
    
    // Add priority filter
    if (activeFilter.value.startsWith("priority-")) {
      params.priority = activeFilter.value.replace("priority-", "");
    }

    // Add search term
    if (searchTerm.value) {
      params.search = searchTerm.value;
    }

    // Add sorting
    if (sortOrder.value) {
      // Map app sort order to API sort parameters
      const [field, direction] = sortOrder.value.split("-");
      params.sort_by = field === "date" ? "due_date" : "priority";
      params.sort_direction = direction;
    }

    // Fetch tasks with these filters
    await fetchTasks(params);
    
    // Mark hydration as complete after first data fetch
    isHydrating.value = false;
  };

  // Set search term and trigger API call
  const setSearchTerm = (term: string) => {
    if (!externalSearchTerm) {
      searchTerm.value = term;
    }
    applyFilters();
  };

  // Set active filter and trigger API call
  const setActiveFilter = (filter: TaskFilter) => {
    activeFilter.value = filter;
    applyFilters();
  };

  // Set sort order and trigger API call
  const setSortOrder = (order: string) => {
    sortOrder.value = order;
    applyFilters();
  };

  // Watch for external search term changes
  if (externalSearchTerm) {
    watch(externalSearchTerm, () => {
      applyFilters();
    });
  }

  // Watch for filter changes
  watch(
    [activeFilter, sortOrder],
    () => {
      // Don't call API during initial component setup on client
      if (process.client && isHydrating.value) return;
      applyFilters();
    },
    { immediate: true }
  );

  // Once mounted (client-side only), mark hydration as complete
  onMounted(() => {
    // Use nextTick to ensure we're fully hydrated
    nextTick(() => {
      isHydrating.value = false;
    });
  });

  return {
    searchTerm,
    activeFilter,
    taskCounts,
    setSearchTerm,
    setActiveFilter,
    sortOrder,
    setSortOrder,
    tasks,
  };
}
