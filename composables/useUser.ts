// composables/useUser.ts
import { reactive } from "vue";

export function useUser() {
  const user = useState('sanctum.user.identity').value.data;

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

  const updateUser = (data: UserUpdateData): void => {    
    Object.assign(user, data);
  };

  return {
    user,
    updateUser,
  };
}
