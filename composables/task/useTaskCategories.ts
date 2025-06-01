export function useTaskCategories() {
  const { $api } = useNuxtApp();
  const { token } = useToken();

const defaultCategories = [
    { name: "Home", icon: "i-heroicons-home" },
    { name: "Work", icon: "i-heroicons-briefcase" },
    { name: "Personal", icon: "i-heroicons-user" },
    { name: "Study", icon: "i-heroicons-academic-cap" },
    { name: "Health", icon: "i-heroicons-heart" },
    { name: "Shopping", icon: "i-heroicons-shopping-cart" },
    { name: "Travel", icon: "i-heroicons-globe-alt" },
    { name: "Finance", icon: "i-heroicons-currency-dollar" },
    { name: "Entertainment", icon: "i-heroicons-film" },
    { name: "Fitness", icon: "i-heroicons-fire" },
    { name: "Family", icon: "i-heroicons-users" },
    { name: "Goals", icon: "i-heroicons-trophy" },
    { name: "Food", icon: "i-heroicons-cake" },
    { name: "Books", icon: "i-heroicons-book-open" },
    { name: "Technology", icon: "i-heroicons-computer-desktop" },
    { name: "Creative", icon: "i-heroicons-paint-brush" },
    { name: "Social", icon: "i-heroicons-chat-bubble-left-right" },
    { name: "Garden", icon: "i-heroicons-scissors" },
    { name: "Car", icon: "i-heroicons-truck" },
    { name: "Urgent", icon: "i-heroicons-exclamation-triangle" },
    { name: "Hobbies", icon: "i-heroicons-puzzle-piece" },
    { name: "Meeting", icon: "i-heroicons-calendar-days" }
  ];
  
  const categories = useState('categories', () => {
    return [...defaultCategories];
  });
  const isLoading = ref(false);

  const fetchCategories = async () => {
    try {
      isLoading.value = true;
      const response = await $api("/api/task/categories", {
        method: "GET",
        headers: {
          Authorization: token.value,
        },
      });

      if (response.status === "success") {
        // Transform API data
        const apiCategories = response.categories.map((cat) => ({
          name: cat.category,
          icon: cat.categoryIcon || "i-heroicons-tag",
        }));

        // Combine with default categories, removing duplicates by name
        const allCategories = [...defaultCategories, ...apiCategories];
        categories.value = allCategories.filter((category, index, self) =>
          index === self.findIndex((c) => c.name === category.name)
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Keep default categories on error
      categories.value = [...defaultCategories];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    categories,
    isLoading,
    fetchCategories,
  };
}
