// composables/task/useTasks.ts
import { ref } from 'vue'
import type { Task } from '~/types/task'

export function useTasks() {
  const tasks = ref<Task[]>([
    {
      id: 1,
      title: 'Research UI frameworks',
      description: 'Evaluate different UI frameworks like Tailwind, Bootstrap, and Material UI for the new project.',
      completed: true,
      priority: 'high',
      dueDate: '2025-05-01'
    },
    {
      id: 2,
      title: 'Design dashboard layout',
      description: 'Create wireframes and mockups for the main dashboard using Figma.',
      completed: false,
      priority: 'medium',
      dueDate: '2025-05-03'
    },
    {
      id: 3,
      title: 'Implement authentication flow',
      description: 'Set up JWT authentication with refresh tokens and secure storage.',
      completed: false,
      priority: 'high',
      dueDate: '2025-05-05'
    },
    {
      id: 4,
      title: 'Create database schema',
      description: 'Design and implement the database schema for users, tasks, and projects.',
      completed: false,
      priority: 'low',
      dueDate: '2025-05-10'
    }
  ])

  // Task CRUD operations
  const addTask = (newTask: Task) => {
    tasks.value.push(newTask)
  }

  const deleteTask = (taskId: number) => {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  }

  const toggleTaskComplete = (taskId: number) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.completed = !task.completed
    }
  }

  const updateTask = (updatedTask: Task) => {
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = { ...updatedTask }
    }
  }

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTaskComplete,
    updateTask
  }
}