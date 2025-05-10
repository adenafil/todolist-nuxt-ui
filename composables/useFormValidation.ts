import * as z from 'zod'

export function useFormValidation() {
  // Login schema
  const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters')
  })

  // Register schema with password confirmation
  const registerSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Must be at least 8 characters')
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })

  // Forgot password schema
  const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email')
  })

  return {
    loginSchema,
    registerSchema,
    forgotPasswordSchema
  }
}