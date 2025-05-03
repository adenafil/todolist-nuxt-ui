import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

export function useAuth() {
  const { loginSchema, registerSchema, forgotPasswordSchema } = useFormValidation()
  
  type LoginSchema = z.output<typeof loginSchema>   
  type RegisterSchema = z.output<typeof registerSchema>
  type ForgotPasswordSchema = z.output<typeof forgotPasswordSchema>
  
  // Form states
  const loginState = reactive<Partial<LoginSchema>>({
    email: undefined,
    password: undefined
  })

  const registerState = reactive<Partial<RegisterSchema>>({
    email: undefined,
    password: undefined,
    confirmPassword: undefined
  })

  const forgotPasswordState = reactive<Partial<ForgotPasswordSchema>>({
    email: undefined
  })

  // Form type state
  const formType = ref('login') // 'login', 'register', or 'forgotPassword'
  const isLogin = computed(() => formType.value === 'login')
  const isRegister = computed(() => formType.value === 'register')
  const isForgotPassword = computed(() => formType.value === 'forgotPassword')
  
  // Form submission handlers
  const toast = useToast()
  
  async function onLoginSubmit(event: FormSubmitEvent<LoginSchema>) {
    toast.add({ title: 'Success', description: 'Logged in successfully.', color: 'success' })
    console.log(event.data)
    // Here you would add actual auth logic
  }

  async function onRegisterSubmit(event: FormSubmitEvent<RegisterSchema>) {
    toast.add({ title: 'Success', description: 'Account created successfully.', color: 'success' })
    console.log(event.data)
    // Here you would add actual registration logic
  }

  async function onForgotPasswordSubmit(event: FormSubmitEvent<ForgotPasswordSchema>) {
    toast.add({ title: 'Success', description: 'Password reset link sent to your email.', color: 'success' })
    console.log(event.data)
    // Reset to login form after successful submission
    formType.value = 'login'
  }

  return {
    // Schemas
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    
    // States
    loginState,
    registerState,
    forgotPasswordState,
    
    // Form type
    formType,
    isLogin,
    isRegister,
    isForgotPassword,
    
    // Handlers
    onLoginSubmit,
    onRegisterSubmit,
    onForgotPasswordSubmit
  }
}