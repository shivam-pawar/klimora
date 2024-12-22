import { useFavoriteCity } from "@/hooks/useFavoriteCity";
import { WeatherResponse } from "@/types/types";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

export const Favorite: React.FC<{ data: WeatherResponse; name: string }> = ({
  data,
  name,
}) => {
  const { addToFavorite, isFavorite, removeFavorite } = useFavoriteCity();
  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);
  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.info(`Removed ${name} from favorites`);
    } else {
      addToFavorite.mutate({
        lat: data.coord.lat,
        lon: data.coord.lon,
        name,
        country: data.sys.country,
      });
      toast.success(`Added ${name} to favorites`);
    }
  };
  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size={"icon"}
      className={isCurrentlyFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
      onClick={handleToggleFavorite}
    >
      <Star
        className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`}
      />
    </Button>
  );
};
