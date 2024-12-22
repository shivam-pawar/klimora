import { Coord } from "@/types/types";
import { useEffect, useState } from "react";

interface GeolocationState {
  coordinates: Coord | null;
  error: string | null;
  isLoading: boolean;
}
export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        error: "Geolocation is not supported",
        isLoading: false,
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        setLocationData({
          coordinates: null,
          error: error.message,
          isLoading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { ...locationData, getLocation };
}
