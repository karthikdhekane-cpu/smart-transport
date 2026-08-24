// Weather Types

export type WeatherCondition = 
  | 'sunny' 
  | 'cloudy' 
  | 'rainy' 
  | 'stormy' 
  | 'snowy' 
  | 'foggy' 
  | 'unknown';

export interface WeatherData {
  temperature: number;      // Celsius
  condition: WeatherCondition;
  humidity: number;         // Percentage
  visibility: number;       // Kilometers
  windSpeed: number;        // km/h
  windDirection: string;    // Direction text
  feelsLike: number;        // Celsius
  uvIndex: number;          // 1-11+
  lastUpdated: number;      // Timestamp
  isLoading: boolean;
  error?: string;
}

export interface WeatherService {
  getCurrentWeather(): Promise<WeatherData | null>;
  getWeatherForLocation(lat: number, lng: number): Promise<WeatherData | null>;
  getWeatherForecast(): Promise<WeatherData[]>;
  refresh(): Promise<void>;
  getWeatherIcon(condition: WeatherCondition): string;
  getWeatherColor(condition: WeatherCondition): string;
}
