import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalstorage } from "./useLocalstorage";

interface FavoriteCity {
  id: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  addedAt: string;
}

export function useFavoriteCity() {
  const queryClient = useQueryClient();
  const [favorites, setFavorites] = useLocalstorage<FavoriteCity[]>(
    "favorites",
    []
  );
  const favoriteQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity,
  });

  const addToFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
      const newFavorite = {
        ...city,
        id: `${city.lat}-${city.lon}`,
        addedAt: Date.now(),
      };
      const exists = favorites.some(
        (item: FavoriteCity) => item.id === newFavorite.id
      );
      if (exists) return favorites;
      const newFavorites = [...favorites, newFavorite].slice(0, 10);
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter(
        (item: FavoriteCity) => item.id !== cityId
      );
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  return {
    favorites: favoriteQuery.data,
    addToFavorite,
    removeFavorite,
    isFavorite: (lat: number, lon: number) =>
      favorites.some(
        (item: FavoriteCity) => item.lat === lat && item.lon === lon
      ),
  };
}
