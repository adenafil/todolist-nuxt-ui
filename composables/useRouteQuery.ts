export function useRouteQuery() {
  const route = useRoute();
  const router = useRouter();

  // Initial values from URL
  const page = computed(() => {
    const pageParam = route.query.page;
    return pageParam ? parseInt(pageParam as string) : 1;
  });

  const search = computed(() => {
    return (route.query.search as string) || "";
  });

  const filter = computed(() => {
    return (route.query.filter as string) || "all";
  });

  const sort = computed(() => {
    return (route.query.sort as string) || "date-asc";
  });

  const perPage = computed(() => {
    const perPageParam = route.query.perPage;
    return perPageParam ? parseInt(perPageParam as string) : 5;
  });

  // Update URL methods
  const updateQuery = (params: Record<string, any>) => {
    // Preserve existing query params and merge with new ones
    const newQuery = {
      ...route.query,
      ...params,
    };

    // Remove undefined or null values
    Object.keys(newQuery).forEach((key) => {
      if (newQuery[key] === undefined || newQuery[key] === null) {
        delete newQuery[key];
      }
    });

    // Update URL without reloading the page
    router.push({ query: newQuery });
  };

  return {
    // Query values
    page,
    search,
    filter,
    sort,
    perPage,

    // Update methods
    updatePage: (newPage: number) => updateQuery({ page: newPage }),
    updateSearch: (newSearch: string) => updateQuery({ search: newSearch || undefined, page: 1 }),
    updateFilter: (newFilter: string) => updateQuery({ filter: newFilter, page: 1 }),
    updateSort: (newSort: string) => updateQuery({ sort: newSort, page: 1 }),
    updatePerPage: (newPerPage: number) => updateQuery({ perPage: newPerPage, page: 1 }),
  };
}
