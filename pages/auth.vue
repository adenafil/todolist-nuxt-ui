<script setup lang="ts">
const { 
  loginSchema, registerSchema, forgotPasswordSchema,
  loginState, registerState, forgotPasswordState,
  formType, isLogin, isRegister, isForgotPassword,
  onLoginSubmit, onRegisterSubmit, onForgotPasswordSubmit
} = useAuth()

const handleNavigate = (type: any) => {
  formType.value = type
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950">
    <UCard class="w-full max-w-md shadow-xl border-0">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold mb-1">
          <template v-if="isLogin">Welcome Back 👋</template>
          <template v-else-if="isRegister">Create Account</template>
          <template v-else>Forgot Password</template>
        </h1>
        <p class="text-sm text-gray-500">
          <template v-if="isLogin">Sign in to your account to continue</template>
          <template v-else-if="isRegister">Sign up to get started</template>
          <template v-else>Enter your email to reset password</template>
        </p>
      </div>

      <!-- Dynamic form components based on formType -->
      <AuthLoginForm 
        v-if="isLogin"
        :schema="loginSchema"
        :state="loginState"
        :on-submit="onLoginSubmit"
        @navigate="handleNavigate"
      />

      <AuthRegisterForm
        v-else-if="isRegister"
        :schema="registerSchema"
        :state="registerState"
        :on-submit="onRegisterSubmit"
      />
      
      <AuthForgotPasswordForm
        v-else
        :schema="forgotPasswordSchema"
        :state="forgotPasswordState"
        :on-submit="onForgotPasswordSubmit"
      />

      <!-- Social login section -->
      <AuthSocialLogin v-if="!isForgotPassword" />
      
      <!-- Form navigation links -->
      <div class="text-center mt-4 text-sm">
        <template v-if="isLogin">
          Don't have an account?
          <UButton variant="link" color="primary" @click="formType = 'register'">Create account</UButton>
        </template>
        <template v-else-if="isRegister">
          Already have an account?
          <UButton variant="link" color="primary" @click="formType = 'login'">Sign in</UButton>
        </template>
        <template v-else>
          Remember your password?
          <UButton variant="link" color="primary" @click="formType = 'login'">Back to login</UButton>
        </template>
      </div>
    </UCard>
  </div>
</template>