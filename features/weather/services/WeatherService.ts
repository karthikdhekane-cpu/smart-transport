// Weather Service
// Provides weather information with mock data for demo
// Can be extended to use real weather API when configured

import type { WeatherData, WeatherService, WeatherCondition } from '../types';

// Mock weather data for demo purposes
const MOCK_WEATHER_DATA: WeatherData = {
  temperature: 28,
  condition: 'sunny',
  humidity: 65,
  visibility: 10,
  windSpeed: 12,
  windDirection: 'NE',
  feelsLike: 30,
  uvIndex: 7,
  lastUpdated: Date.now(),
  isLoading: false,
};

// Weather condition icon mapping
const WEATHER_ICONS: Record<WeatherCondition, string> = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  snowy: '❄️',
  foggy: '🌫️',
  unknown: '❓',
};

// Weather condition color mapping
const WEATHER_COLORS: Record<WeatherCondition, string> = {
  sunny: 'text-amber-400',
  cloudy: 'text-gray-400',
  rainy: 'text-blue-400',
  stormy: 'text-purple-400',
  snowy: 'text-white',
  foggy: 'text-gray-400',
  unknown: 'text-gray-500',
};

class WeatherServiceImpl implements WeatherService {
  constructor() {
    // Initialize with mock data
  }

  async getCurrentWeather(): Promise<WeatherData | null> {
    // In production, this would fetch from a real weather API
    // For demo, return mock data
    return this.getMockWeather();
  }

  async getWeatherForLocation(lat: number, lng: number): Promise<WeatherData | null> {
    // In production, this would fetch from a real weather API
    // For demo, return mock data
    return this.getMockWeather();
  }

  async getWeatherForecast(): Promise<WeatherData[]> {
    // Return mock forecast data
    const forecast: WeatherData[] = [];
    const conditions: WeatherCondition[] = ['sunny', 'sunny', 'cloudy', 'rainy', 'sunny'];
    
    for (let i = 0; i < 5; i++) {
      forecast.push({
        temperature: 25 + Math.random() * 5,
        condition: conditions[i],
        humidity: 50 + Math.random() * 40,
        visibility: 8 + Math.random() * 4,
        windSpeed: 8 + Math.random() * 10,
        windDirection: ['N', 'NE', 'E', 'SE', 'S'][Math.floor(Math.random() * 5)],
        feelsLike: 27 + Math.random() * 5,
        uvIndex: 4 + Math.floor(Math.random() * 5),
        lastUpdated: Date.now(),
        isLoading: false,
      });
    }
    
    return forecast;
  }

  async refresh(): Promise<void> {
    // Reset any cached data
    // In production, this would trigger a fresh API call
  }

  private getMockWeather(): WeatherData {
    // Return mock weather data with some randomness
    const conditions: WeatherCondition[] = ['sunny', 'cloudy', 'rainy', 'sunny'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      ...MOCK_WEATHER_DATA,
      temperature: Math.round(25 + Math.random() * 8),
      condition: condition,
      humidity: Math.round(50 + Math.random() * 40),
      windSpeed: Math.round(8 + Math.random() * 15),
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      lastUpdated: Date.now(),
      isLoading: false,
    };
  }

  getWeatherIcon(condition: WeatherCondition): string {
    return WEATHER_ICONS[condition] || WEATHER_ICONS.unknown;
  }

  getWeatherColor(condition: WeatherCondition): string {
    return WEATHER_COLORS[condition] || WEATHER_COLORS.unknown;
  }
}

// Export singleton instance
let weatherServiceInstance: WeatherService | null = null;

export const weatherService = (() => {
  if (!weatherServiceInstance) {
    weatherServiceInstance = new WeatherServiceImpl();
  }
  return weatherServiceInstance;
})();
