// composables/profile/useAvatarUpload.ts
import { ref } from "vue";
import { useUser } from "../useUser";
import { useNotifications } from "../useToast";

export function useAvatarUpload() {
  const { user, updateUser } = useUser();
  const { showSuccessToast, showErrorToast } = useNotifications();
  const { $api } = useNuxtApp();
  const { token } = useToken();

  const isAvatarModalOpen = ref(false);
  const avatarPreview = ref(user.avatar);
  const imageFile = ref<File | null>(null); // Store the actual File object

  const uploadAvatar = async () => {
    if (!imageFile.value) {
      showErrorToast("Please select an image first");
      return;
    }

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append("avatar", imageFile.value);

      const { data, error, status } = await $api("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type, browser will set it with boundary for FormData
          Authorization: token.value,
        },
        // Add these options to disable caching
        key: Date.now().toString(), // Unique key to prevent caching
        getCachedData: () => undefined, // Disable fetching from cache
        cache: false, // Disable caching completely
      });

      if (status.value === "error") {
        throw new Error(error.value.data.message);
      }

      updateUser({ avatar: data.value.avatar });
      isAvatarModalOpen.value = false;
      showSuccessToast("Profile photo updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      showErrorToast("An error occurred while uploading the avatar");
    }
  };

  interface FileReaderEvent extends ProgressEvent {
    target: FileReader;
  }

  const handleAvatarChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Store the actual File object
      imageFile.value = file;

      // Create a preview URL for display purposes
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent) => {
        const readerEvent = e as FileReaderEvent;
        if (readerEvent.target && typeof readerEvent.target.result === "string") {
          avatarPreview.value = readerEvent.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    isAvatarModalOpen,
    avatarPreview,
    uploadAvatar,
    handleAvatarChange,
  };
}
