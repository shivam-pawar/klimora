import { Link } from "react-router-dom";
import { useTheme } from "../context/theme-provider";
import { Moon, Sun } from "lucide-react";
import { CitySearch } from "./CitySearch";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className="sticky top-0 w-full border-b z-50 bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-16 px-4 flex justify-between items-center">
        <Link to="/">
          <img
            src={isDark ? "/assets/LogoDark.svg" : "/assets/LogoLight.svg"}
            alt="Logo"
            className="h-14"
          />
        </Link>
        <div className="flex gap-4">
          <CitySearch />
          <div
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="h-6 w-6 text-gray-800 rotate-0 transition-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
