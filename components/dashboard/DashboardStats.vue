<script setup lang="ts">
defineProps({
    stats: {
        type: Array,
        required: true
    }
})
</script>

<template>
    <!-- hi ade nafil, pleasse check again or do research about why this fucking component data only rendered on client side -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <UCard v-for="stat in stats" :key="stat.label" class="flex items-center">
                <div class="flex items-center">
                    <UIcon :name="stat.icon" :class="`text-${stat.color}-500 text-xl mr-3`" />
                    <div>
                        <div class="text-2xl font-bold">{{ stat.value }}</div>
                        <div class="text-sm text-gray-500">{{ stat.label }}</div>
                    </div>

                </div>
            </UCard>
        </div>
</template>