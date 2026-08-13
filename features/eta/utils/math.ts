// Math utilities for ETA calculations
// This is the single source of truth for math functions

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Return meters
}

// Calculate bearing between two points
export function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  
  const fromLat = toRadians(lat1);
  const fromLng = toRadians(lng1);
  const toLat = toRadians(lat2);
  const toLng = toRadians(lng2);

  const dLng = toLng - fromLng;
  const y = Math.sin(dLng) * Math.cos(toLat);
  const x = Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng);
  
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

// Interpolate between two points
export function interpolatePosition(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  progress: number
): { lat: number; lng: number } {
  return {
    lat: lat1 + (lat2 - lat1) * progress,
    lng: lng1 + (lng2 - lng1) * progress,
  };
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Format distance for display
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

// Format speed for display
export function formatSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

// Format seconds to time string
export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}
