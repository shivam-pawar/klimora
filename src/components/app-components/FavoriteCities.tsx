import { useFavoriteCity } from "@/hooks/useFavoriteCity";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/useWeather";
import { Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

export const FavoriteCities = () => {
  const { favorites, removeFavorite } = useFavoriteCity();
  if (!favorites.length) {
    return null;
  }
  return (
    <>
      <h1 className="text-xl font-bold tracking-tight">Favorites</h1>
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4">
          {favorites.map((city: FavoriteCity) => (
            <MyFavoriteCities
              key={city.id}
              {...city}
              onRemove={(id: string) => removeFavorite.mutate(id)}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

function MyFavoriteCities({ id, name, lat, lon, onRemove }: FavoriteCity) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
      className="relative flex min-w-[250px] cursor-pointer gap-3 items-center rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
    >
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.info(`Removed ${name} from favorites`);
        }}
        className="absolute top-1 right-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </Button>
      {isLoading ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weather ? (
        <>
          <div className="flex  items-center gap-2">
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].description}
              className="w-8 h-8"
            />
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">
                {weather.sys.country}
              </p>
            </div>
          </div>
          <div className="m-auto text-right">
            <p className="text-xl font-bold">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : (
        <h2 className="text-lg font-bold">{name}</h2>
      )}
    </div>
  );
}
