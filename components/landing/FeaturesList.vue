<script setup lang="ts">

const features = reactive({
    items: [
        {
            icon: 'i-heroicons-list-bullet',
            title: 'Organize Tasks',
            description: 'Keep track of all your tasks in one place'
        },
        {
            icon: 'i-heroicons-bell-alert',
            title: 'Set Reminders',
            description: 'Never miss important deadlines again'
        },
        {
            icon: 'i-heroicons-chart-bar',
            title: 'Track Progress',
            description: 'Monitor your productivity and achievements'
        }
    ]   
})

</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <LandingFeatureCard v-for="feature in features.items" :key="feature.title" :icon="feature.icon" :title="feature.title"
            :description="feature.description" />
    </div>
</template>