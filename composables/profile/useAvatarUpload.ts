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

      const data = await $api("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type, browser will set it with boundary for FormData
          Authorization: token.value,
        },
        // Add these options to disable caching
      });

      console.log(data);
      

      if (data.status !== "success") {
        console.log(data.message);
        
        throw new Error(data.message || "Failed to upload avatar");
      }

      updateUser({ avatar: data.avatar });
      isAvatarModalOpen.value = false;
      showSuccessToast(data.message || "Avatar uploaded successfully");
    } catch (error) {
      console.log(error);
      
      showErrorToast(error.message || "An error occurred while uploading the avatar");
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
