import { WeatherResponse, Location } from "@/types/types";
import { Card, CardContent } from "../ui/card";
import {
  ArrowDown,
  ArrowUp,
  Droplets,
  Sunrise,
  Sunset,
  Wind,
} from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherResponse;
  locationName?: Location;
}
export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  locationName,
}) => {
  const {
    main: { temp, feels_like, temp_min, temp_max, humidity },
    weather: [currentWeather],
    wind: { speed },
    sys: { sunrise, sunset },
    name,
  } = data;

  const formatTemperature = (temp: number) => {
    return `${temp.toFixed(0)}°C`;
  };
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-end gap-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  {locationName?.name}
                </h2>
                {locationName?.state && (
                  <span className="text-muted-foreground">
                    , {name}, {locationName.state}, {locationName.country}
                  </span>
                )}
              </div>
              <p>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <div className="flex items-center gap-8">
              <p className="text-7xl font-bold tracking-tighter">
                {formatTemperature(temp)}
              </p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Feels like {formatTemperature(feels_like)}
                </p>
                <div className="flex gap-2 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-4 w-4" />
                    {formatTemperature(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-4 w-4" />
                    {formatTemperature(temp_max)}
                  </span>
                </div>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <Sunrise className="h-6 w-6 text-orange-500" />
                <p className="text-sm text-muted-foreground">
                  {new Date(sunrise * 1000).toLocaleTimeString()}
                </p>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <Sunset className="h-6 w-6 text-orange-300" />
                <p className="text-sm text-muted-foreground">
                  {new Date(sunset * 1000).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-6 w-6 text-blue-500" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Humidity</p>
                    <p className="text-sm text-muted-foreground">{humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-6 w-6 text-blue-500" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Wind Speed</p>
                    <p className="text-sm text-muted-foreground">{speed} m/s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img
                src={`http://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 text-center">
                <p className="text-sm font-medium capitalize">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
