// composables/task/useTasks.ts
import { ref, onMounted } from "vue";
import type { Task } from "~/types/task";
import { useTaskCategories } from "./useTaskCategories";

export function useTasks() {
  const { $api, $clearApiCache } = useNuxtApp();
  const { token } = useToken();
  const { showSuccessToast, showErrorToast } = useNotifications();
  const route = useRoute();
  const { fetchCategories, categories } = useTaskCategories();

  const tasks = useState<Task[]>("tasks", () => []);
  const isLoading = useState("isLoading", () => true);
  const totalPages = ref(1);
  const currentPage = ref(1);
  const totalTasks = useState("totalTasks", () => 0);

  // Fetch tasks with filters
  const fetchTasks = async (params = {}) => {
    isLoading.value = true;
    try {
      // Build URL with query parameters
      let queryString = new URLSearchParams(params).toString();
      const url = `/api/tasks${queryString ? `?${queryString}` : ""}`;

      const response = await $api(url, {
        method: "GET",
        headers: {
          Authorization: token.value,
        },
        // Add a small cache lifetime for tasks to ensure fresh data
        cacheLifetime: 30 * 1000, // 30 seconds
      });

      if (response && response.data) {
        // Map API data to our Task format
        tasks.value = response.data.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category || "",
          categoryIcon: item.categoryIcon || "",
          description: item.description || "",
          priority: item.priority,
          status: item.status,
          dueDate: item.due_date,
          completed: item.status === "completed",
        }));

        // Update pagination data
        if (response.meta) {
          totalPages.value = response.meta.last_page;
          currentPage.value = response.meta.current_page;
          totalTasks.value = response.meta.total;
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showErrorToast("Failed to load tasks");
    } finally {
      isLoading.value = false;
    }
  };

  // Task CRUD operations
  const addTask = async (newTask: Task) => {
    isLoading.value = true;
    console.log("Adding task:", newTask);

    try {
      const response = await $api("/api/tasks", {
        method: "POST",
        body: newTask,
        headers: {
          Authorization: token.value,
        },
      });

      if (response.status === "success") {
        showSuccessToast("Task added successfully");
        // Explicitly clear cache after mutation
        $clearApiCache(/\/api\/tasks/);
        $clearApiCache(/\/api\/task\/categories/);
        await fetchTasks(); // Refresh tasks
        await fetchCategories(); // Refresh categories
      } else {
        showErrorToast(response.message || "Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      showErrorToast("Failed to add task");
    } finally {
      isLoading.value = false; // Ensure loading state is turned off
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const response = await $api(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: token.value,
        },
      });

      if (response.status === "success") {
        // Remove from local state
        tasks.value = tasks.value.filter((t) => t.id !== taskId);
        showSuccessToast("Task deleted successfully");
        // Explicitly clear cache after mutation
        $clearApiCache(/\/api\/tasks/);
        fetchTasks();
        await fetchTasks(); // Refresh tasks
        await fetchCategories(); // Refresh categories
      } else {
        showErrorToast("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showErrorToast("Failed to delete task");
    }
  };

  const toggleTaskComplete = async (taskId: number) => {
    try {
      const task = tasks.value.find((t) => t.id === taskId);

      if (!task) return;


      const newStatus = task.completed ? "in_progress" : "completed";
      task.completed = !task.completed;

      console.log("Updating task status:", taskId, "to", newStatus);
      

      const response = await $api(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: {
          status: newStatus,
        },
        headers: {
          Authorization: token.value,
        },
      });

      if (response.status === "success") {
        // Update local state
        task.status = newStatus;
        showSuccessToast("Task status updated");
        // Explicitly clear cache after mutation
        $clearApiCache(/\/api\/tasks/);
      } else {
        showErrorToast("Failed to update task status");
      }
    } catch (error) {
      task.completed = !task.completed;

      console.error("Error updating task status:", error);
      showErrorToast("Failed to update task status");
    }
  };

  const updateTask = async (updatedTask: Task) => {
    console.log("Updating task:", updatedTask);

    try {
      const response = await $api(`/api/tasks/${updatedTask.id}`, {
        method: "PATCH",
        body: {
          title: updatedTask.title,
          description: updatedTask.description,
          category: updatedTask.category,
          categoryIcon: updatedTask.categoryIcon,
          priority: updatedTask.priority,
          due_date: updatedTask.due_date,
        },
        headers: {
          Authorization: token.value,
        },
      });

      if (response.status === "success") {
        // Update local state
        const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
        if (index !== -1) {
          tasks.value[index] = { ...updatedTask };
        }
        showSuccessToast("Task updated successfully");
        // Explicitly clear cache after mutation
        $clearApiCache(/\/api\/tasks/);
        await fetchTasks(); // Refresh tasks
        $clearApiCache(/\/api\/task\/categories/);
        await fetchCategories(); // Refresh categories
      } else {
        showErrorToast("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      showErrorToast("Failed to update task");
    }
  };

  // export task
  const exportTasks = async () => {
    isLoading.value = true;
    try {
      const response = await $api("/api/my-tasks/export", {
        method: "get",
        headers: {
          Authorization: token.value,
        },
      });
      isLoading.value = false;

      // Create download link
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      // Generate filename with current date and filters
      const date = new Date().toISOString().split("T")[0];
      link.download = `my-tasks_${date}.xlsx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      showSuccessToast("Tasks exported successfully!");
    } catch (error) {
      isLoading.value = false;
      console.error("Error exporting tasks:", error);
      showErrorToast("Failed to export tasks");
    }
  };

  return {
    tasks,
    isLoading,
    totalPages,
    currentPage,
    totalTasks,
    fetchTasks,
    addTask,
    deleteTask,
    toggleTaskComplete,
    updateTask,
    exportTasks,
  };
}
