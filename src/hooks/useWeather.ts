import { weatherAPI } from "@/api/endpoints/weather";
import { Coord } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
  weather: (coords: Coord) => [`weather-${coords.lat}-${coords.lon}`],
  forecast: (coords: Coord) => [`forecast-${coords.lat}-${coords.lon}`],
  location: (coords: Coord) => [`location-${coords.lat}-${coords.lon}`],
  search: (query: string) => [`search-${query}`],
};

export function useWeatherQuery(coordinates: Coord | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useForecastQuery(coordinates: Coord | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => (coordinates ? weatherAPI.getForecast(coordinates) : null),
    enabled: !!coordinates,
  });
}

export function useReverseGeocodeQuery(coordinates: Coord | null) {
  return useQuery({
    queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () =>
      coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useLocationSearchQuery(query: string) {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => weatherAPI.searchLocations(query),
    enabled: query.length > 3,
  });
}
