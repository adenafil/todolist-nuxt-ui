// composables/task/useTaskModals.ts
import { ref } from 'vue'
import type { Task } from '~/types/task'

export function useTaskModals() {
  const isAddTaskModalOpen = ref(false)
  const isEditTaskModalOpen = ref(false)
  const currentTaskToEdit = ref<Task | null>(null)

  const openAddTaskModal = () => {
    isAddTaskModalOpen.value = true
  }

  const closeAddTaskModal = () => {
    isAddTaskModalOpen.value = false
  }

  const openEditTaskModal = (task: Task) => {
    currentTaskToEdit.value = { ...task }
    isEditTaskModalOpen.value = true
  }

  const closeEditTaskModal = () => {
    isEditTaskModalOpen.value = false
    currentTaskToEdit.value = null
  }

  return {
    isAddTaskModalOpen,
    isEditTaskModalOpen,
    currentTaskToEdit,
    openAddTaskModal,
    closeAddTaskModal,
    openEditTaskModal,
    closeEditTaskModal
  }
}