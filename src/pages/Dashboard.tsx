import { CurrentWeather } from "@/components/app-components/CurrentWeather";
import { FavoriteCities } from "@/components/app-components/FavoriteCities";
import { HourlyTemperature } from "@/components/app-components/HourlyTemperature";
import { LoadingSkeleton } from "@/components/app-components/LoadingSkeleton";
import { WeatherDetails } from "@/components/app-components/WeatherDetails";
import { WeatherForecast } from "@/components/app-components/WeatherForecast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/useWeather";
import { ForecastResponse, Location, WeatherResponse } from "@/types/types";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

export const Dashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeolocation();

  const locationQuery = useReverseGeocodeQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  const refreshLocation = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p className="pt-4">{locationError}</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p className="pt-4">
            Please enable location access to see your location weather
          </p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (locationLoading || weatherQuery.isFetching || forecastQuery.isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <FavoriteCities />
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={refreshLocation}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <CurrentWeather
            data={weatherQuery.data ?? ({} as WeatherResponse)}
            locationName={locationQuery.data?.[0] as Location}
          />
          {forecastQuery.data && <HourlyTemperature {...forecastQuery.data} />}
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data ?? ({} as WeatherResponse)} />
          <WeatherForecast
            data={forecastQuery.data ?? ({} as ForecastResponse)}
          />
        </div>
      </div>
    </div>
  );
};
