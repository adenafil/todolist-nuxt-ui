import { reactive } from "vue";
import { useUser } from "../useUser";
import { useProfileValidation } from "./useProfileValidation";
import { useNotifications } from "../useToast";

export function useProfileForms() {
  const { user, updateUser } = useUser();
  const { validatePersonalInfo, validatePassword, personalErrors, passwordErrors } = useProfileValidation();
  const { showSuccessToast } = useNotifications();

  // Reactive states for forms
  const personalInfo = reactive({
    name: user.name,
    email: user.email,
    bio: user.bio,
    location: user.location,
  });

  const passwordData = reactive({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Update handler functions
  const updatePersonalInfo = () => {
    if (validatePersonalInfo(personalInfo)) {
      // Would make API call to update data
      updateUser(personalInfo);
      showSuccessToast("Profile information updated successfully");
    }
  };

  const updatePassword = () => {
    if (validatePassword(passwordData)) {
      // Would verify current password and update password
      console.log("Password updated:", passwordData);
      passwordData.currentPassword = "";
      passwordData.newPassword = "";
      passwordData.confirmPassword = "";
      showSuccessToast("Password updated successfully");
    }
  };

  return {
    personalInfo,
    passwordData,
    personalErrors,
    passwordErrors,
    updatePersonalInfo,
    updatePassword,
  };
}
