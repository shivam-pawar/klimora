import { useState } from "react";
import { Button } from "../ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearchQuery } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { LocalNames } from "@/types/types";
import { useFavoriteCity } from "@/hooks/useFavoriteCity";

export const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: locations, isLoading } = useLocationSearchQuery(query);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { favorites } = useFavoriteCity();
  const navigate = useNavigate();
  const handleSelect = (value: string) => {
    const [lat, lon, name, country] = value.split("|");
    addToHistory.mutate({
      lat,
      lon,
      name,
      country,
      query,
    });
    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
    setQuery("");
  };
  return (
    <>
      <Button
        variant={"outline"}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="h-6 w-6" />
        Search
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search Cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No Cities found.</CommandEmpty>
          )}
          {favorites && favorites.length > 0 && (
            <CommandGroup heading="Favorites">
              {favorites.map((item: LocalNames) => (
                <CommandItem
                  key={item.id}
                  value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>
                    {item.name}
                    {item.state && (
                      <span className="text-xs text-muted-foreground">
                        , {item.state}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      , {item.country}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {history && history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex justify-between items-center px-2 my-2">
                  <p className="text-sm text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant="ghost"
                    className="text-xs text-muted-foreground"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                {history.map((item: LocalNames) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    <Clock className="h-4 w-4" />
                    <span>
                      {item.name}
                      {item.state && (
                        <span className="text-xs text-muted-foreground">
                          , {item.state}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        , {item.country}
                      </span>
                      <span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          - {item.searchedAt}
                        </span>
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>
                    {location.name}
                    {location.state && (
                      <span className="text-xs text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      , {location.country}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
