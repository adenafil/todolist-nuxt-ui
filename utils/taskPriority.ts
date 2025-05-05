export type TaskPriority = "high" | "medium" | "low";

export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "neutral";
  }
}

export function getPriorityWeight(priority: TaskPriority): number {
  switch (priority) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

export const PRIORITY_OPTIONS = [
  {
    id: "priority-high",
    label: "High Priority",
    icon: "i-heroicons-arrow-trending-up",
    value: "high",
    color: "error",
  },
  {
    id: "priority-medium",
    label: "Medium Priority",
    icon: "i-heroicons-minus",
    value: "medium",
    color: "warning",
  },
  {
    id: "priority-low",
    label: "Low Priority",
    icon: "i-heroicons-arrow-trending-down",
    value: "low",
    color: "success",
  },
];
