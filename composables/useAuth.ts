import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

export function useAuth() {
  const { loginSchema, registerSchema, forgotPasswordSchema } = useFormValidation();
  const { add } = useToast();

  // Replace the ref with useState for global state management
  const formType = useState<string>("authFormType", () => "login");

  type LoginSchema = z.output<typeof loginSchema>;
  type RegisterSchema = z.output<typeof registerSchema>;
  type ForgotPasswordSchema = z.output<typeof forgotPasswordSchema>;

  // Form states
  const loginState = reactive<Partial<LoginSchema>>({
    email: undefined,
    password: undefined,
  });

  const registerState = reactive<Partial<RegisterSchema>>({
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
    fullName: "",
  });

  const forgotPasswordState = reactive<Partial<ForgotPasswordSchema>>({
    email: undefined,
  });

  // Use computed values based on the shared state
  const isLogin = computed(() => formType.value === "login");
  const isRegister = computed(() => formType.value === "register");
  const isForgotPassword = computed(() => formType.value === "forgotPassword");

  // Form submission handlers
  const toast = useToast();
  const router = useRouter();
  const { login } = useSanctumAuth();

  async function onLoginSubmit(event: FormSubmitEvent<LoginSchema>) {
    console.log(event.data);
    try {
      const response = await login(event.data);
      toast.add({ title: "Success", description: "Logged in successfully.", color: "success" });
    } catch(error) {
      toast.add({
        title: "Failed",
        description: error.response._data.message,
        color: "error",
      });
    }
  } 

  async function onRegisterSubmit(event: FormSubmitEvent<RegisterSchema>) {
    console.log(event.data);
    // Here you would add actual registration logic

    try {
      const data = await $fetch("http://localhost:8000/api/register", {
        method: "POST",
        body: {
          email: event.data.email,
          password: event.data.password,
          password_confirmation: event.data.confirmPassword,
          name: event.data.fullName,
        },
      });

      await login({
        email: event.data.email,
        password: event.data.password,
      });

      toast.add({ title: "Success", description: "User register successfully and will be logged in.", color: "success" });
    } catch (error) {
      console.log(error.response._data.message);
      toast.add({
        title: "Failed",
        description: error.response._data.message,
        color: "error",
      });
    }
  }

  async function onForgotPasswordSubmit(event: FormSubmitEvent<ForgotPasswordSchema>) {
    toast.add({ title: "Success", description: "Password reset link sent to your email.", color: "success" });
    console.log(event.data);
    // Reset to login form after successful submission
    formType.value = "login";
  }

  return {
    // Schemas
    loginSchema,
    registerSchema: {
      ...registerSchema,
      fullName: {
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
      },
    },
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
    onForgotPasswordSubmit,
  };
}
