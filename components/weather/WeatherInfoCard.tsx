'use client';
import { useState, useEffect } from 'react';
import { weatherService } from '@/features/weather';

interface WeatherInfoCardProps {
  title?: string;
  className?: string;
}

export default function WeatherInfoCard({ title = 'Current Weather', className = '' }: WeatherInfoCardProps) {
  const [weather, setWeather] = useState<import('@/features/weather').WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const data = await weatherService.getCurrentWeather();
        setWeather(data);
      } catch (err) {
        setError('Failed to load weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    
    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`glass rounded-2xl p-6 ${className}`}>
        <h3 className="font-bold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-32 text-gray-400 animate-pulse">
          <span>Loading weather data...</span>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`glass rounded-2xl p-6 ${className}`}>
        <h3 className="font-bold text-white mb-4">{title}</h3>
        <div className="text-gray-400 text-sm">
          {error || 'Weather data unavailable'}
        </div>
      </div>
    );
  }

  const weatherIcon = weatherService.getWeatherIcon(weather.condition);
  const weatherColor = weatherService.getWeatherColor(weather.condition);

  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">{title}</h3>
        <span className="text-xs text-gray-500">{new Date(weather.lastUpdated).toLocaleTimeString()}</span>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="text-6xl">{weatherIcon}</div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{weather.temperature}°</span>
            <span className="text-lg text-gray-400">C</span>
          </div>
          <div className={`text-sm font-medium ${weatherColor} capitalize`}>
            {weather.condition}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl text-white mb-1">💧</div>
          <div className="text-xs text-gray-400">Humidity</div>
          <div className="text-lg font-bold text-white">{weather.humidity}%</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl text-white mb-1">����</div>
          <div className="text-xs text-gray-400">Wind</div>
          <div className="text-lg font-bold text-white">{weather.windSpeed} km/h</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl text-white mb-1">👁️</div>
          <div className="text-xs text-gray-400">Visibility</div>
          <div className="text-lg font-bold text-white">{weather.visibility} km</div>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <div className="text-2xl text-white mb-1">🌡️</div>
          <div className="text-xs text-gray-400">Feels Like</div>
          <div className="text-lg font-bold text-white">{weather.feelsLike}°C</div>
        </div>
      </div>
      
      <div className="mt-4 p-3 glass rounded-xl text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-400">UV Index:</span>
          <span className={`font-bold ${weather.uvIndex >= 8 ? 'text-red-400' : weather.uvIndex >= 5 ? 'text-[#FFD700]' : 'text-[#00C853]'}`}>
            {weather.uvIndex}
          </span>
        </div>
      </div>
    </div>
  );
}
