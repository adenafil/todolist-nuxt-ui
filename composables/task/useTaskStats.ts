// composables/task/useTaskStats.ts
import { computed } from "vue";
import type { Task } from "~/types/task";

export function useTaskStats(filteredTasks: Ref<Task[]>) {
  // Helper function untuk cek expired
  const isExpired = (task: Task): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.dueDate);
    return !task.completed && taskDate < today;
  };

  const taskStats = computed(() => [
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
  ]);

  // Breakdown priority stats (bisa digunakan untuk chart/grafik)
  const priorityBreakdown = computed(() => {
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
