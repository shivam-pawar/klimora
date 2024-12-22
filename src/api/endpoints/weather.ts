import {
  Coord,
  ForecastResponse,
  Location,
  WeatherResponse,
} from "@/types/types";
import { API_CONFIG } from "../config";

class WeatherAPI {
  private createUrl(
    baseUrl: string,
    endpoint: string,
    params: Record<string, string | number>
  ): string {
    const searchParams = new URLSearchParams({
      ...params,
      appid: API_CONFIG.API_KEY,
    });
    return `${baseUrl}/${endpoint}?${searchParams.toString()}`;
  }
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  }
  async getCurrentWeather({ lat, lon }: Coord): Promise<WeatherResponse> {
    const url = this.createUrl(API_CONFIG.baseUrl, "weather", {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
    });
    return this.fetchData<WeatherResponse>(url);
  }

  async getForecast({ lat, lon }: Coord): Promise<ForecastResponse> {
    const url = this.createUrl(API_CONFIG.baseUrl, "forecast", {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
    });
    return this.fetchData<ForecastResponse>(url);
  }

  async reverseGeocode({ lat, lon }: Coord): Promise<Location[]> {
    const url = this.createUrl(API_CONFIG.GeoCodeBaseUrl, "reverse", {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      limit: 1,
    });
    return this.fetchData<Location[]>(url);
  }

  async searchLocations(query: string): Promise<Location[]> {
    const url = this.createUrl(API_CONFIG.GeoCodeBaseUrl, "direct", {
      q: query,
      lang: API_CONFIG.DEFAULT_PARAMS.lang,
      limit: 5,
    });
    return this.fetchData<Location[]>(url);
  }
}

export const weatherAPI = new WeatherAPI();
