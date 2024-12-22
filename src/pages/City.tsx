import { CurrentWeather } from "@/components/app-components/CurrentWeather";
import { Favorite } from "@/components/app-components/Favorite";
import { HourlyTemperature } from "@/components/app-components/HourlyTemperature";
import { LoadingSkeleton } from "@/components/app-components/LoadingSkeleton";
import { WeatherDetails } from "@/components/app-components/WeatherDetails";
import { WeatherForecast } from "@/components/app-components/WeatherForecast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForecastQuery, useWeatherQuery } from "@/hooks/useWeather";
import { ForecastResponse, WeatherResponse } from "@/types/types";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

export const City = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const coordinates = { lat, lon };
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p className="pt-4">Location not found</p>
        </AlertDescription>
      </Alert>
    );
  }
  if (weatherQuery.isFetching || forecastQuery.isFetching || !params.cityName) {
    return <LoadingSkeleton />;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data?.sys.country}
        </h1>
        <div>
          <Favorite
            data={weatherQuery.data ?? ({} as WeatherResponse)}
            name={params.cityName}
          />
        </div>
      </div>
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <CurrentWeather data={weatherQuery.data ?? ({} as WeatherResponse)} />
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
