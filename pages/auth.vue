<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

// Login schema
const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters')
})

// Register schema with password confirmation
const registerSchema = z.object({
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

type LoginSchema = z.output<typeof loginSchema>
type RegisterSchema = z.output<typeof registerSchema>
type ForgotPasswordSchema = z.output<typeof forgotPasswordSchema>

// Login state
const loginState = reactive<Partial<LoginSchema>>({
    email: undefined,
    password: undefined
})

// Register state
const registerState = reactive<Partial<RegisterSchema>>({
    email: undefined,
    password: undefined,
    confirmPassword: undefined
})

// Forgot password state
const forgotPasswordState = reactive<Partial<ForgotPasswordSchema>>({
    email: undefined
})

// Toggle between login, register, and forgot password forms
const formType = ref('login') // 'login', 'register', or 'forgotPassword'
const isLogin = computed(() => formType.value === 'login')
const isRegister = computed(() => formType.value === 'register')
const isForgotPassword = computed(() => formType.value === 'forgotPassword')

const toast = useToast()
async function onLoginSubmit(event: FormSubmitEvent<LoginSchema>) {
    toast.add({ title: 'Success', description: 'Logged in successfully.', color: 'success' })
    console.log(event.data)
}

async function onRegisterSubmit(event: FormSubmitEvent<RegisterSchema>) {
    toast.add({ title: 'Success', description: 'Account created successfully.', color: 'success' })
    console.log(event.data)
}

async function onForgotPasswordSubmit(event: FormSubmitEvent<ForgotPasswordSchema>) {
    toast.add({ title: 'Success', description: 'Password reset link sent to your email.', color: 'success' })
    console.log(event.data)
    // Reset to login form after successful submission
    formType.value = 'login'
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-indigo-950">
        <UCard class="w-full max-w-md shadow-xl border-0">
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold mb-1">
                    <template v-if="isLogin">Welcome Back</template>
                    <template v-else-if="isRegister">Create Account</template>
                    <template v-else>Forgot Password</template>
                </h1>
                <p class="text-sm text-gray-500">
                    <template v-if="isLogin">Sign in to your account to continue</template>
                    <template v-else-if="isRegister">Sign up to get started</template>
                    <template v-else>Enter your email to reset password</template>
                </p>
            </div>

            <!-- Login Form -->
            <UForm v-if="isLogin" :schema="loginSchema" :state="loginState" class="space-y-5 px-3" @submit="onLoginSubmit">
                <UFormField label="Email address" name="email">
                    <UInput v-model="loginState.email" size="lg" class="w-full" icon="i-heroicons-envelope" placeholder="your@email.com" />
                </UFormField>

                <UFormField label="Password" name="password">
                    <UInput v-model="loginState.password" type="password" size="lg" class="w-full" icon="i-heroicons-lock-closed" placeholder="••••••••" />
                </UFormField>
                
                <div class="text-right">
                    <UButton variant="link" color="primary" size="sm" @click="formType = 'forgotPassword'">Forgot password?</UButton>
                </div>

                <UButton type="submit" block size="lg" color="primary" class="mt-2">
                    Sign in
                </UButton>
            </UForm>

            <!-- Register Form -->
            <UForm v-else-if="isRegister" :schema="registerSchema" :state="registerState" class="space-y-5 px-3" @submit="onRegisterSubmit">
                <UFormField label="Email address" name="email">
                    <UInput v-model="registerState.email" size="lg" class="w-full" icon="i-heroicons-envelope" placeholder="your@email.com" />
                </UFormField>

                <UFormField label="Password" name="password">
                    <UInput v-model="registerState.password" type="password" size="lg" class="w-full" icon="i-heroicons-lock-closed" placeholder="••••••••" />
                </UFormField>
                
                <UFormField label="Confirm Password" name="confirmPassword">
                    <UInput v-model="registerState.confirmPassword" type="password" size="lg" class="w-full" icon="i-heroicons-lock-closed" placeholder="••••••••" />
                </UFormField>

                <UButton type="submit" block size="lg" color="primary" class="mt-2">
                    Create Account
                </UButton>
            </UForm>
            
            <!-- Forgot Password Form -->
            <UForm v-else :schema="forgotPasswordSchema" :state="forgotPasswordState" class="space-y-5 px-3" @submit="onForgotPasswordSubmit">
                <UFormField label="Email address" name="email">
                    <UInput v-model="forgotPasswordState.email" size="lg" class="w-full" icon="i-heroicons-envelope" placeholder="your@email.com" />
                </UFormField>

                <UButton type="submit" block size="lg" color="primary" class="mt-6">
                    Reset Password
                </UButton>
            </UForm>

            <div v-if="!isForgotPassword" class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white dark:bg-gray-900 text-gray-500">
                        Or continue with
                    </span>
                </div>
            </div>

            <div v-if="!isForgotPassword" class="grid grid-cols-2 gap-3 mb-4">
                <UButton color="neutral" variant="outline" block icon="i-simple-icons-google">
                    Google
                </UButton>
                <UButton color="neutral" variant="outline" block icon="i-simple-icons-github">
                    GitHub
                </UButton>
            </div>
            
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