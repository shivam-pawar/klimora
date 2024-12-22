import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalstorage } from "./useLocalstorage";

interface SearchHistory {
  id: string;
  query: string;
  lat: string;
  lon: string;
  name: string;
  country: string;
  state?: string;
  searchedAt: string;
}

export function useSearchHistory() {
  const queryClient = useQueryClient();
  const [history, setHistory] = useLocalstorage<SearchHistory[]>(
    "searchHistory",
    []
  );
  const historyQuery = useQuery({
    queryKey: ["searchHistory"],
    queryFn: () => history,
    initialData: history,
  });

  const addToHistory = useMutation({
    mutationFn: async (search: Omit<SearchHistory, "id" | "searchedAt">) => {
      const newSearch = {
        ...search,
        id: `${search.lat}-${search.lon}-${Date.now()}`,
        searchedAt: Date.now(),
      };
      const filteredHistory = history.filter(
        (item: SearchHistory) =>
          !(item.lat === search.lat && item.lon === search.lon)
      );
      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);
      setHistory(newHistory);
      return newHistory;
    },
    onSuccess: (newHistory) => {
      queryClient.setQueryData(["searchHistory"], newHistory);
    },
  });

  const clearHistory = useMutation({
    mutationFn: async () => {
      setHistory([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(["searchHistory"], []);
    },
  });

  return {
    history: historyQuery.data ?? [],
    addToHistory,
    clearHistory,
  };
}
