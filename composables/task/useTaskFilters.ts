import { ref, computed, watch, nextTick } from "vue";
import type { Task, TaskFilter, TaskStats } from "~/types/task";
import { isDateExpired } from "~/utils/dates";
import { getPriorityWeight } from "~/utils/taskPriority";

export function useTaskFilters(tasks: Ref<Task[]>, externalSearchTerm?: Ref<string>) {
  // Use the external search term if provided, otherwise create a local one
  const searchTerm = externalSearchTerm || ref("");
  const activeFilter = ref<TaskFilter>("all");
  const sortOrder = ref("date-asc");

  // Update search term function (only needed if using a local search term)
  const setSearchTerm = (term: string) => {
    if (!externalSearchTerm) {
      searchTerm.value = term;
    }
  };

  const setActiveFilter = (filter: TaskFilter) => {
    activeFilter.value = filter;
  };

  const setSortOrder = (order: string) => {
    sortOrder.value = order;
  };

  // PERBAIKAN: Enhance filtered tasks computation
  const filteredTasks = computed(() => {
    // Create a fresh copy to ensure reactive updates
    let filtered = [...tasks.value];

    // Apply search filter
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase().trim();
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(term) || (task.description && task.description.toLowerCase().includes(term)));
    }

    // Apply tab filter
    switch (activeFilter.value) {
      case "in-progress":
        filtered = filtered.filter((task) => !task.completed && !isDateExpired(task.dueDate));
        break;
      case "completed":
        filtered = filtered.filter((task) => task.completed);
        break;
      case "expired":
        filtered = filtered.filter((task) => isDateExpired(task.dueDate));
        break;
      case "priority-high":
        filtered = filtered.filter((task) => task.priority === "high");
        break;
      case "priority-medium":
        filtered = filtered.filter((task) => task.priority === "medium");
        break;
      case "priority-low":
        filtered = filtered.filter((task) => task.priority === "low");
        break;
      default:
        // "all" filter - no additional filtering
        break;
    }

    return filtered;
  });

  // Apply sorting after filtering
  const filteredAndSortedTasks = computed(() => {
    const filtered = [...filteredTasks.value];

    // Sort based on current sort order
    switch (sortOrder.value) {
      case "date-asc":
        filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        break;
      case "date-desc":
        filtered.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        break;
      case "priority-desc":
        filtered.sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority));
        break;
      case "priority-asc":
        filtered.sort((a, b) => getPriorityWeight(a.priority) - getPriorityWeight(b.priority));
        break;
    }

    return filtered;
  });

  // Task counts for filter tabs
  const taskCounts = computed<TaskStats>(() => {
    return {
      all: tasks.value.length,
      inProgress: tasks.value.filter((t) => !t.completed && !isDateExpired(t.dueDate)).length,
      completed: tasks.value.filter((t) => t.completed).length,
      expired: tasks.value.filter((t) => isDateExpired(t.dueDate)).length,
      priorityHigh: tasks.value.filter((t) => t.priority === "high").length,
      priorityMedium: tasks.value.filter((t) => t.priority === "medium").length,
      priorityLow: tasks.value.filter((t) => t.priority === "low").length,
    };
  });

  return {
    searchTerm,
    activeFilter,
    filteredTasks,
    taskCounts,
    setSearchTerm,
    setActiveFilter,
    sortOrder,
    setSortOrder,
    filteredAndSortedTasks,
  };
}
