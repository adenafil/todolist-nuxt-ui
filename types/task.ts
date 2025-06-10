export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "completed" | "expired" | "in_progress";

export interface Task {
  id?: number;
  title: string;
  description?: string;
  category?: string;
  categoryIcon?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string; // This will map to due_date from API
  completed: boolean; // Derived from status
  user_id?: number;
  created_at?: string;
  updated_at?: string;
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
