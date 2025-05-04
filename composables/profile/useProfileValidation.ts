import { ref } from 'vue'
import { z } from 'zod'

export function useProfileValidation() {
  const personalInfoSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    bio: z.string().max(250, 'Bio must be 250 characters or less').optional(),
    location: z.string().optional()
  })

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(8, 'Please confirm your password')
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })

  // Form validation
  const personalErrors = ref({})
  
  interface PersonalInfo {
    name: string;
    email: string;
    bio?: string;
    location?: string;
  }

  type ValidationErrors = Record<string, string[]>;

  const validatePersonalInfo = (data: PersonalInfo): boolean => {
    try {
      personalInfoSchema.parse(data);
      personalErrors.value = {} as ValidationErrors;
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        personalErrors.value = error.flatten().fieldErrors as ValidationErrors;
      }
      return false;
    }
  }

  const passwordErrors = ref({})
  interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  const validatePassword = (data: PasswordData): boolean => {
    try {
      passwordSchema.parse(data);
      passwordErrors.value = {} as ValidationErrors;
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        passwordErrors.value = error.flatten().fieldErrors as ValidationErrors;
      }
      return false;
    }
  }

  return {
    personalErrors,
    passwordErrors,
    validatePersonalInfo,
    validatePassword
  }
}