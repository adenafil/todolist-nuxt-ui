<script setup lang="ts">
useSeoMeta({
    title: 'Welcome 🥳💖',
    ogTitle: 'Welcome 🥳💖',
    description: 'Streamline your productivity with our intuitive task management application. Organize, prioritize, and complete your tasks efficiently.',
    ogDescription: 'Streamline your productivity with our intuitive task management application. Organize, prioritize, and complete your tasks efficiently.',
    author: "Ade Nafil Firmansah",
    keywords: "task management, productivity, task tracker, to-do list, task organization, Ade Nafil Firmansah, Husni Mubarok, Achmad Wildan Muzaky",
})
</script>

<template>
    <div
        class="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div class="max-w-3xl w-full text-center">
            <LandingHeroSection />
            <LandingFeaturesList />
            <LandingAuthButtons />
            <LandingFooter />
        </div>
    </div>
</template>