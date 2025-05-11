export function useActivityLog(initialPage = 1, perPage = 3) {
  const { $api } = useNuxtApp();
  const isLoading = ref(true);
  const currentPage = ref(initialPage);
  const totalPages = ref(1);
  const activityLog = ref([]);
  const { token } = useToken();

  // Gunakan key untuk caching
  const fetchLogs = async (pageNum = 1) => {
    isLoading.value = true;
    try {
      const { data } = await $api(`/api/user/activity?per_page=${perPage}&page=${pageNum}`, {
        method: "GET",
        headers: {
          Authorization: token.value,
        },
      });

      // Perbaikan untuk mendapatkan nilai yang benar dari response API
      currentPage.value = pageNum;

      // Ambil total halaman dari meta data API response
      totalPages.value = Array.isArray(data.value.meta?.last_page) ? data.value.meta.last_page[0] : data.value.meta?.last_page || 1;

      // Update activity log dengan data baru
      activityLog.value = data.value.data.map((item: any) => {
        return {
          action: item.action,
          device: item.device,
          date: new Date(item.created_at).toLocaleString(),
          ip: item.ip_address,
        };
      });

      return activityLog.value;
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Panggil fetchLogs hanya saat diperlukan, tidak langsung
  const goToPage = async (pageNum: number) => {
    await fetchLogs(pageNum);
  };

  // Inisialisasi data
  onMounted(() => {
    fetchLogs(initialPage);
  });

  return {
    activityLog,
    isLoading,
    currentPage,
    totalPages,
    goToPage,
  };
}
