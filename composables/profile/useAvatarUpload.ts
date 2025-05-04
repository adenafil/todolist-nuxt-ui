// composables/profile/useAvatarUpload.ts
import { ref } from "vue";
import { useUser } from "../useUser";
import { useNotifications } from "../useToast";

export function useAvatarUpload() {
  const { user, updateUser } = useUser();
  const { showSuccessToast } = useNotifications();

  const isAvatarModalOpen = ref(false);
  const avatarPreview = ref(user.avatar);

  const uploadAvatar = () => {
    updateUser({ avatar: avatarPreview.value });
    isAvatarModalOpen.value = false;
    showSuccessToast("Profile photo updated successfully");
  };

  interface FileReaderEvent extends ProgressEvent {
    target: FileReader;
  }

  const handleAvatarChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent) => {
        const readerEvent = e as FileReaderEvent;
        if (readerEvent.target && typeof readerEvent.target.result === 'string') {
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
