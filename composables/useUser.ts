// composables/useUser.ts
import { reactive } from "vue";

export function useUser() {
  const user = reactive({
    name: "Gus Husni Mubarok Duduk",
    email: "husni@example.com",
    avatar: "https://avatars.githubusercontent.com/u/151940728?v=4",
    joinDate: "2024-01-01",
    bio: "Full Stack Developer with passion for clean UI and efficient code.",
    location: "Surabaya, Indonesia",
  });

  // Update user data
  // Define a User interface
  interface User {
    name: string;
    email: string;
    avatar: string;
    joinDate: string;
    bio: string;
    location: string;
  }

  // Define interface for update data (partial user)
  interface UserUpdateData extends Partial<User> {}

  const updateUser = (data: UserUpdateData): void => {
    Object.assign(user, data);
  };

  return {
    user,
    updateUser,
  };
}
