// composables/useUser.ts
import { reactive } from "vue";

export function useUser() {
  const user = useState('sanctum.user.identity').value.data; 
  const { $api } = useNuxtApp(); 

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
    

    Object.assign(user, data);
  };

  return {
    user,
    updateUser,
  };
}
