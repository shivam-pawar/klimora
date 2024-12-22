import { ForecastResponse } from "@/types/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

export const WeatherForecast: React.FC<{ data: ForecastResponse }> = ({
  data,
}) => {
  const dailyForecast = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        date: forecast.dt,
        min: forecast.main.temp_min,
        max: forecast.main.temp_max,
        weather: forecast.weather[0].description,
        wind: forecast.wind.speed,
        humidity: forecast.main.humidity,
      };
    } else {
      if (forecast.main.temp_min < acc[date].min) {
        acc[date].min = forecast.main.temp_min;
      }
      if (forecast.main.temp_max > acc[date].max) {
        acc[date].max = forecast.main.temp_max;
      }
    }

    return acc;
  }, {} as Record<string, { date: number; min: number; max: number; weather: string; wind: number; humidity: number }>);

  const nextDays = Object.values(dailyForecast).slice(1, 6);

  console.log(nextDays);

  return (
    <Card>
      <CardHeader>
        <CardTitle>5 Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {day.weather}
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <span className="flex items-center text-blue-500">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {Math.round(day.max)}°
                </span>
                <span className="flex items-center text-red-500">
                  {Math.round(day.min)}°
                  <ArrowUp className="mr-1 h-4 w-4" />
                </span>
              </div>
              <div className="flex justify-end gap-4">
                <span className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{day.wind} m/s</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-sm">{day.humidity}%</span>
                  <Droplets className="h-4 w-4 text-blue-500" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
