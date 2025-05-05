export function useSearchState() {
  // Create persistent state that works across components
  const searchTerm = useState<string>("searchTerm", () => "");

  // Helper function for updating the search term
  function setSearchTerm(term: string) {
    searchTerm.value = term;
  }

  return {
    searchTerm,
    setSearchTerm,
  };
}
