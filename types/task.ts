export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "completed" | "expired" | "in-progress";

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate: string;
}

export type TaskFilter = "all" | "in-progress" | "completed" | "expired" | "priority-high" | "priority-medium" | "priority-low";

export interface TaskStats {
  all: number;
  inProgress: number;
  completed: number;
  expired: number;
  priorityHigh: number;
  priorityMedium: number;
  priorityLow: number;
}
