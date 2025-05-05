export default defineNuxtPlugin(() => {
  // App configuration that can be used throughout the application
  const appConfig = {
    appName: "Taskify",
    appLogo: "i-mdi:task-auto",
    dateFormat: "en-US",
    itemsPerPageOptions: [5, 10, 25, 50],
    defaultItemsPerPage: 5,
    priorities: [
      { value: "high", label: "High", color: "error" },
      { value: "medium", label: "Medium", color: "warning" },
      { value: "low", label: "Low", color: "success" },
    ],
    sortOptions: [
      { value: "date-asc", label: "Date (Oldest First)" },
      { value: "date-desc", label: "Date (Newest First)" },
      { value: "priority-desc", label: "Priority (High to Low)" },
      { value: "priority-asc", label: "Priority (Low to High)" },
    ],
  };

  return {
    provide: {
      appConfig, // Changed from 'config' to 'appConfig'
    },
  };
});
