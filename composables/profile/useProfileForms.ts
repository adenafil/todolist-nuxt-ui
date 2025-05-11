import { reactive } from "vue";
import { useUser } from "../useUser";
import { useProfileValidation } from "./useProfileValidation";
import { useNotifications } from "../useToast";

export function useProfileForms() {
  const { user, updateUser } = useUser();
  const { validatePersonalInfo, validatePassword, personalErrors, passwordErrors } = useProfileValidation();
  const { showSuccessToast, showErrorToast } = useNotifications();
  const { $api } = useNuxtApp();
  const { token } = useToken();

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
  const updatePersonalInfo = async () => {
    if (validatePersonalInfo(personalInfo)) {
      // Would make API call to update data
      updateUser(personalInfo);
    }
  };

  const updatePassword = async () => {
    if (validatePassword(passwordData)) {
      // Would verify current password and update password
      console.log("Password updated:", passwordData);

      console.log(token);

      try {
        const { status, data, error } = await $api("/api/user/change-password", {
          method: "PATCH",
          body: {
            current_password: passwordData.currentPassword,
            password: passwordData.newPassword,
            password_confirmation: passwordData.confirmPassword,
          },
          headers: {
            Authorization: token.value,
          },
        });

        if (status.value === "error") {
          throw new Error(error.value.data.message);
        }

        showSuccessToast("Password updated successfully");
      } catch (error: any) {
        showErrorToast(error.message || "An error occurred while updating the password");
      } finally {
        passwordData.currentPassword = "";
        passwordData.newPassword = "";
        passwordData.confirmPassword = "";
      }
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
