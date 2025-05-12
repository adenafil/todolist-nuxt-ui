// composables/task/useTaskStats.ts
import { computed } from "vue";
import type { Task } from "~/types/task";

export function useTaskStats(filteredTasks: Ref<Task[]>) {
  const { $isHydrating } = useNuxtApp();

  // Helper function to check expired
  const isExpired = (task: Task): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.dueDate);
    return !task.completed && taskDate < today;
  };

  const taskStats = computed(() => {
    // During hydration, return zeros to match server-side rendering
    if ($isHydrating.value) {
      return [
        {
          label: "Total Tasks",
          value: 0,
          icon: "i-heroicons-clipboard-document-list",
          color: "sky",
        },
        {
          label: "Completed",
          value: 0,
          icon: "i-heroicons-check-circle",
          color: "primary",
        },
        {
          label: "In Progress",
          value: 0,
          icon: "i-heroicons-clock",
          color: "warning",
        },
        {
          label: "Expired",
          value: 0,
          icon: "i-heroicons-exclamation-triangle",
          color: "red",
        },
      ];
    }

    // Normal stats calculation after hydration
    return [
      {
        label: "Total Tasks",
        value: filteredTasks.value.length,
        icon: "i-heroicons-clipboard-document-list",
        color: "sky",
      },
      {
        label: "Completed",
        value: filteredTasks.value.filter((t) => t.completed).length,
        icon: "i-heroicons-check-circle",
        color: "primary",
      },
      {
        label: "In Progress",
        value: filteredTasks.value.filter((t) => !t.completed && !isExpired(t)).length,
        icon: "i-heroicons-clock",
        color: "warning",
      },
      {
        label: "Expired",
        value: filteredTasks.value.filter((t) => isExpired(t)).length,
        icon: "i-heroicons-exclamation-triangle",
        color: "red",
      },
    ];
  });

  // Similar approach for priorityBreakdown
  const priorityBreakdown = computed(() => {
    if ($isHydrating.value) {
      return {
        high: 0,
        medium: 0,
        low: 0,
      };
    }

    return {
      high: filteredTasks.value.filter((t) => t.priority === "high").length,
      medium: filteredTasks.value.filter((t) => t.priority === "medium").length,
      low: filteredTasks.value.filter((t) => t.priority === "low").length,
    };
  });

  return {
    taskStats,
    priorityBreakdown,
  };
}
