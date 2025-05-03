<script setup lang="ts">
definePageMeta({
    layout: 'login'
})

// User data - akan dihubungkan dengan autentikasi/state management yang sebenarnya nanti
const user = reactive({
    name: 'Gus Husni Mubarok Duduk',
    email: 'husni@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/151940728?v=4',
    role: 'Admin',
    joinDate: '2024-01-01',
    bio: 'Full Stack Developer with passion for clean UI and efficient code.',
    location: 'Surabaya, Indonesia',
    timezone: 'Asia/Jakarta',
    socials: {
        github: 'gushusni',
        twitter: 'gushusni',
        linkedin: 'gushusni'
    }
})

// Reactive states for forms
const personalInfo = reactive({
    name: user.name,
    email: user.email,
    bio: user.bio,
    location: user.location
})

const passwordData = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})


// Form validation schemas
import { z } from 'zod'

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

// Tabs for profile sections
const activeTab = ref('personal')

// Avatar upload functionality
const isAvatarModalOpen = ref(false)
const avatarPreview = ref(user.avatar)

// Notification for successful updates
const toast = useToast()
const showSuccessToast = (message: string) => {
    toast.add({
        title: 'Success',
        description: message,
        color: 'green',
        icon: 'i-heroicons-check-circle',
        timeout: 3000
    })
}

// Form validation
const personalErrors = ref({})
const validatePersonalInfo = () => {
    try {
        personalInfoSchema.parse(personalInfo)
        personalErrors.value = {}
        return true
    } catch (error) {
        personalErrors.value = error.flatten().fieldErrors
        return false
    }
}

const passwordErrors = ref({})
const validatePassword = () => {
    try {
        passwordSchema.parse(passwordData)
        passwordErrors.value = {}
        return true
    } catch (error) {
        passwordErrors.value = error.flatten().fieldErrors
        return false
    }
}

// Update handler functions
const updatePersonalInfo = () => {
    if (validatePersonalInfo()) {
        // Would make API call to update data
        Object.assign(user, personalInfo)
        showSuccessToast('Profile information updated successfully')
    }
}

const updatePassword = () => {
    if (validatePassword()) {
        // Would verify current password and update password
        console.log('Password updated:', passwordData)
        passwordData.currentPassword = ''
        passwordData.newPassword = ''
        passwordData.confirmPassword = ''
        showSuccessToast('Password updated successfully')
    }
}


const uploadAvatar = () => {
    user.avatar = avatarPreview.value
    isAvatarModalOpen.value = false
    showSuccessToast('Profile photo updated successfully')
}

const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = e => {
            avatarPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

// Activity log data
const activityLog = [
    { action: 'Login', device: 'Chrome on Windows', date: '2025-05-04T14:30:00', ip: '198.51.100.42' },
    { action: 'Password changed', device: 'Chrome on Windows', date: '2025-05-01T10:15:00', ip: '198.51.100.42' },
    { action: 'Login', device: 'Mobile App on Android', date: '2025-04-29T08:45:00', ip: '203.0.113.17' }
]
</script>

<template>
    <div class="max-w-5xl mx-auto">
        <!-- Profile Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold mb-1 text-gray-800 dark:text-white">Profile Settings</h1>
            <p class="text-gray-500 dark:text-gray-400">Manage your account profile</p>
        </div>

        <!-- Profile Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Sidebar - User Card -->
            <div class="md:col-span-1">
                <UCard class="mb-6">
                    <div class="flex flex-col items-center">
                        <div class="relative group mb-4">
                            <UAvatar :src="user.avatar" :alt="user.name" size="2xl" />


                            <!-- Improved Avatar Upload Modal, similar to Add Task Modal -->
                            <UModal v-model="isAvatarModalOpen" title="Profile picture"
                                description="Choose a new profile picture">
                                <UButton class="absolute inset-0 flex items-center justify-center bg-gray-900/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" label="Open" color="neutral" variant="subtle" >
                                    <UIcon name="i-heroicons-camera" class="text-lg" />
    
                                </UButton>


                                <template #body>
                                    <div class="space-y-6">
                                        <div class="flex justify-center">
                                            <UAvatar :src="avatarPreview" :alt="user.name" size="2xl" />
                                        </div>

                                        <div>
                                            <input type="file" id="avatar-upload" accept="image/*"
                                                @change="handleAvatarChange" class="hidden" />
                                            <label for="avatar-upload"
                                                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                                <UIcon name="i-heroicons-photo" class="mr-2" />
                                                Choose a Photo
                                            </label>
                                        </div>
                                    </div>

                                    <div class="flex justify-end gap-2 mt-10">
                                        <UButton @click="isAvatarModalOpen = false" color="secondary" variant="soft"
                                            size="lg">
                                            Cancel
                                        </UButton>
                                        <UButton @click="uploadAvatar" color="primary" size="lg">
                                            Upload
                                        </UButton>
                                    </div>

                                </template>
                            </UModal>

                        </div>
                        <h3 class="text-lg font-medium">{{ user.name }}</h3>
                        <p class="text-gray-500 text-sm">{{ user.email }}</p>
                        <UBadge color="primary" class="mt-2">{{ user.role }}</UBadge>
                        <div class="text-xs text-gray-500 mt-2 flex items-center">
                            <UIcon name="i-heroicons-calendar" class="mr-1" />
                            Member since {{ new Date(user.joinDate).toLocaleDateString() }}
                        </div>
                    </div>
                </UCard>

                <!-- Navigation Menu -->
                <UCard>
                    <div class="divide-y divide-gray-200 dark:divide-gray-700">
                        <button @click="activeTab = 'personal'"
                            class="w-full text-left py-3 px-2 flex items-center rounded-t transition-colors"
                            :class="activeTab === 'personal' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'">
                            <UIcon name="i-heroicons-user" class="mr-2" />
                            Personal Information
                        </button>
                        <button @click="activeTab = 'password'"
                            class="w-full text-left py-3 px-2 flex items-center transition-colors"
                            :class="activeTab === 'password' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'">
                            <UIcon name="i-heroicons-key" class="mr-2" />
                            Change Password
                        </button>
                        <button @click="activeTab = 'security'"
                            class="w-full text-left py-3 px-2 flex items-center rounded-b transition-colors"
                            :class="activeTab === 'security' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'">
                            <UIcon name="i-heroicons-shield-check" class="mr-2" />
                            Security
                        </button>
                    </div>
                </UCard>
            </div>

            <!-- Main Content -->
            <div class="md:col-span-2">
                <!-- Personal Information Form -->
                <UCard v-if="activeTab === 'personal'" class="mb-6">
                    <template #header>
                        <div class="font-medium">Personal Information</div>
                    </template>

                    <!-- Improved form layout with consistent spacing -->
                    <div class="space-y-6 px-1">
                        <!-- Full Name -->
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Full Name
                            </label>
                            <UInput id="name" v-model="personalInfo.name" placeholder="Your full name"
                                :color="personalErrors.name ? 'red' : undefined" class="w-full" size="lg" />
                            <p v-if="personalErrors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ personalErrors.name[0] }}
                            </p>
                        </div>

                        <!-- Email Address -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Email Address
                            </label>
                            <UInput id="email" v-model="personalInfo.email" placeholder="Your email address"
                                type="email" :color="personalErrors.email ? 'red' : undefined" class="w-full"
                                size="lg" />
                            <p v-if="personalErrors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ personalErrors.email[0] }}
                            </p>
                        </div>

                        <!-- Bio -->
                        <div>
                            <label for="bio" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Bio
                            </label>
                            <UTextarea id="bio" v-model="personalInfo.bio" placeholder="Tell us about yourself"
                                :color="personalErrors.bio ? 'red' : undefined" class="w-full min-h-[100px]"
                                size="lg" />
                            <p v-if="personalErrors.bio" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ personalErrors.bio[0] }}
                            </p>
                        </div>

                        <!-- Location -->
                        <div>
                            <label for="location"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Location
                            </label>
                            <UInput id="location" v-model="personalInfo.location" placeholder="City, Country"
                                :color="personalErrors.location ? 'red' : undefined" class="w-full" size="lg" />
                            <p v-if="personalErrors.location" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ personalErrors.location[0] }}
                            </p>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex justify-end pt-2">
                            <UButton @click="updatePersonalInfo" color="primary" block>
                                Save Changes
                            </UButton>
                        </div>
                    </div>
                </UCard>

                <!-- Password Change Form -->
                <UCard v-if="activeTab === 'password'" class="mb-6">
                    <template #header>
                        <div class="font-medium">Change Password</div>
                    </template>

                    <!-- Improved password form layout -->
                    <div class="space-y-6 px-1">
                        <!-- Current Password -->
                        <div>
                            <label for="currentPassword"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Current Password
                            </label>
                            <UInput id="currentPassword" v-model="passwordData.currentPassword" type="password"
                                placeholder="Enter your current password"
                                :color="passwordErrors.currentPassword ? 'red' : undefined" class="w-full" size="lg" />
                            <p v-if="passwordErrors.currentPassword"
                                class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ passwordErrors.currentPassword[0] }}
                            </p>
                        </div>

                        <!-- New Password -->
                        <div>
                            <label for="newPassword"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                New Password
                            </label>
                            <UInput id="newPassword" v-model="passwordData.newPassword" type="password"
                                placeholder="Enter new password" :color="passwordErrors.newPassword ? 'red' : undefined"
                                class="w-full" size="lg" />
                            <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ passwordErrors.newPassword[0] }}
                            </p>
                        </div>

                        <!-- Confirm Password -->
                        <div>
                            <label for="confirmPassword"
                                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                Confirm New Password
                            </label>
                            <UInput id="confirmPassword" v-model="passwordData.confirmPassword" type="password"
                                placeholder="Confirm new password"
                                :color="passwordErrors.confirmPassword ? 'red' : undefined" class="w-full" size="lg" />
                            <p v-if="passwordErrors.confirmPassword"
                                class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ passwordErrors.confirmPassword[0] }}
                            </p>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex justify-end pt-2">
                            <UButton @click="updatePassword" color="primary" block>
                                Update Password
                            </UButton>
                        </div>
                    </div>
                </UCard>

                <!-- Security & Login History -->
                <UCard v-if="activeTab === 'security'" class="mb-6">
                    <template #header>
                        <div class="font-medium">Security & Activity</div>
                    </template>
                    <div>
                        <h3 class="text-lg font-medium mb-4">Recent Login Activity</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead class="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Action</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Device</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date</th>
                                        <th
                                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            IP Address</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    <tr v-for="activity in activityLog" :key="activity.date">
                                        <td class="px-4 py-3 whitespace-nowrap text-sm">{{ activity.action }}</td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm">{{ activity.device }}</td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm">
                                            {{ new Date(activity.date).toLocaleString() }}
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm">{{ activity.ip }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </UCard>

                <!-- Delete Account -->
                <UCard v-if="activeTab === 'security'"
                    class="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-medium text-red-700 dark:text-red-400">Delete Account</h3>
                            <p class="text-sm text-red-600 dark:text-red-300">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                        </div>
                        <UButton color="red" variant="soft">
                            Delete Account
                        </UButton>
                    </div>
                </UCard>
            </div>
        </div>



    </div>
</template>