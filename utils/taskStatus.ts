import type { Task } from "~/types/task";
import { isDateExpired } from "./dates";

export type TaskStatus = "completed" | "expired" | "in-progress";

export function getTaskStatus(task: Task): TaskStatus {
  if (task.completed) return "completed";
  if (isDateExpired(task.dueDate)) return "expired";
  return "in-progress";
}

export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "completed":
      return "primary";
    case "expired":
      return "error";
    case "in-progress":
      return "warning";
    default:
      return "neutral";
  }
}

export function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "expired":
      return "Expired";
    case "in-progress":
      return "In Progress";
    default:
      return "Unknown";
  }
}
