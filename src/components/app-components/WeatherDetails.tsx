import { WeatherResponse } from "@/types/types";
import { format } from "date-fns";
import { Compass, Droplet, Gauge, Sunrise, Sunset, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const WeatherDetails: React.FC<{ data: WeatherResponse }> = ({
  data,
}) => {
  const { wind, sys, main } = data;
  const formatTime = (time: number) => {
    return format(new Date(time * 1000), "h:mm a");
  };
  const getWindDirection = (deg: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };
  const details = [
    {
      title: "Sunrise",
      value: formatTime(sys.sunrise),
      icon: Sunrise,
      color: "text-yellow-500",
    },
    {
      title: "Sunset",
      value: formatTime(sys.sunset),
      icon: Sunset,
      color: "text-blue-500",
    },
    {
      title: "Humidity",
      value: `${main.humidity}%`,
      icon: Droplet,
      color: "text-blue-500",
    },
    {
      title: "Wind",
      value: `${wind.speed} m/s`,
      icon: Wind,
      color: "text-blue-500",
    },
    {
      title: "Wind Direction",
      value: getWindDirection(wind.deg),
      icon: Compass,
      color: "text-green-500",
    },
    {
      title: "Pressure",
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: "text-purple-500",
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.title}
              className="flex items-center gap-3 rounded-lg border p-4"
            >
              <detail.icon className={`h-5 w-5 ${detail.color}`} />
              <div>
                <p className="text-sm font-medium leading-none">
                  {detail.title}
                </p>
                <p className={`text-sm ${detail.color}`}>{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
