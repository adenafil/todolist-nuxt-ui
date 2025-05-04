<script setup>
import { useProfileForms } from '~/composables/profile/useProfileForms'

const { personalInfo, personalErrors, updatePersonalInfo } = useProfileForms()
</script>

<template>
    <UCard class="mb-6">
        <template #header>
            <div class="font-medium">Personal Information</div>
        </template>

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
                <UInput id="email" v-model="personalInfo.email" placeholder="Your email address" type="email"
                    :color="personalErrors.email ? 'red' : undefined" class="w-full" size="lg" />
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
                    :color="personalErrors.bio ? 'red' : undefined" class="w-full min-h-[100px]" size="lg" />
                <p v-if="personalErrors.bio" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ personalErrors.bio[0] }}
                </p>
            </div>

            <!-- Location -->
            <div>
                <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
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
</template>