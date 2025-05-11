// composables/useUser.ts
import { reactive } from "vue";

export function useUser() {
  const user = useState("sanctum.user.identity").value.data;
  const { $api } = useNuxtApp();
  const { token } = useToken();
  const { showErrorToast, showSuccessToast } = useNotifications();

  // Update user data
  // Define a User interface
  interface User {
    name: string;
    email: string;
    avatar: string;
    joinDate: string;
    bio: string;
    location: string;
    updated_at: string;
    created_at: string;
  }

  // Define interface for update data (partial user)
  interface UserUpdateData extends Partial<User> {}

  const updateUser = async (data: UserUpdateData): void => {
    console.log(data);

    // Make an API call to update user data
    const { status, error } = await $api("/api/user/update-profile", {
      method: "PATCH",
      body: data,
      headers: {
        Authorization: token.value,
      },
    });

    if (status.value === "error") {
      console.error(error.value.data.message);
      showErrorToast(error.value.data.message || "An error occurred while updating user data");
      return;
    }

    showSuccessToast("Profile information updated successfully");

    Object.assign(user, data);
  };

  return {
    user,
    updateUser,
  };
}
