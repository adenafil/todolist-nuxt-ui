<script setup>
import { useActivityLog } from '~/composables/profile/useActivityLog'

const { activityLog } = useActivityLog()
</script>

<template>
    <UCard class="mb-6">
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
                                Action
                            </th>
                            <th
                                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Device
                            </th>
                            <th
                                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date
                            </th>
                            <th
                                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                IP Address
                            </th>
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
</template>