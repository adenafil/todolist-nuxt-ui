<script setup>
import { useActivityLog } from '~/composables/profile/useActivityLog'

const route = useRoute();
const router = useRouter();

// Ambil parameter page dari URL
const page = ref(parseInt(route.query.page) || 1);
const perPage = ref(3);

// Gunakan composable dengan parameter
const { activityLog, isLoading, currentPage, totalPages, goToPage } = await useActivityLog(page.value, perPage.value);

// Watch untuk perubahan query parameter "page"
watch(() => route.query.page, async (newPage) => {
    if (newPage) {
        const pageNum = parseInt(newPage);
        page.value = pageNum;
        await goToPage(pageNum);
    } else {
        // Default ke halaman 1 jika query parameter tidak ada
        page.value = 1;
        await goToPage(1);
    }
}, { immediate: false });

// Jumlah skeleton row saat loading
const skeletonCount = perPage.value;



// Fungsi untuk mengganti halaman
const changePage = (newPage) => {
    router.push({
        query: {
            ...route.query,
            page: newPage
        }
    });
}
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

                    <!-- Skeleton Loading -->
                    <USkeleton  v-if="isLoading"
                        class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        <tr v-for="i in skeletonCount" :key="`skeleton-${i}`">
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 "></div>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 "></div>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 "></div>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 "></div>
                            </td>
                        </tr>
                    </USkeleton>

                    <!-- Actual Data -->
                    <tbody v-else class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        <tr v-for="activity in activityLog" :key="activity.date">
                            <td  class="px-4 py-3 whitespace-nowrap text-sm">{{ activity.action }}</td>
                            <td  class="px-4 py-3 whitespace-nowrap text-sm">{{ activity.device }}</td>
                            <td  class="px-4 py-3 whitespace-nowrap text-sm">{{ activity.date }}</td>
                            <td  class="px-4 py-3 whitespace-nowrap text-sm">{{ activity.ip }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex justify-center mt-4" v-if="totalPages > 1">
                <UPagination v-model:page="page" :total="totalPages * perPage" :page-count="totalPages"
                    :items-per-page="perPage" @update:page="changePage" />
            </div>
        </div>
    </UCard>
</template>

<style scoped>
</style>