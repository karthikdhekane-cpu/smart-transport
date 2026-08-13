// Math utilities for GPS calculations

// Calculate bearing between two points
export const calculateBearing = (startLat: number, startLng: number, endLat: number, endLng: number): number => {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const fromLat = toRadians(startLat);
  const fromLng = toRadians(startLng);
  const toLat = toRadians(endLat);
  const toLng = toRadians(endLng);

  const dLng = toLng - fromLng;
  const y = Math.sin(dLng) * Math.cos(toLat);
  const x = Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;

  return (bearing + 360) % 360;
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Return meters
};

// Interpolate position between two points
export const interpolatePosition = (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  progress: number
): { lat: number; lng: number } => {
  return {
    lat: startLat + (endLat - startLat) * progress,
    lng: startLng + (endLng - startLng) * progress,
  };
};

// Calculate average speed from positions
export const calculateAverageSpeed = (positions: { lat: number; lng: number; timestamp: number; speed?: number }[]): number => {
  if (positions.length < 2) return 0;
  
  let totalSpeed = 0;
  let count = 0;
  
  for (const pos of positions) {
    if (pos.speed !== undefined) {
      totalSpeed += pos.speed;
      count++;
    }
  }
  
  return count > 0 ? totalSpeed / count : 0;
};

// Format distance in human-readable format
export const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

// Format speed in human-readable format
export const formatSpeed = (speed: number, unit: 'km/h' | 'mph' = 'km/h'): string => {
  if (unit === 'mph') {
    return `${Math.round(speed * 0.621371)} mph`;
  }
  return `${Math.round(speed)} km/h`;
};

// Calculate estimated time
export const calculateETA = (distance: number, speed: number): number => {
  if (speed <= 0) return 0;
  return (distance / (speed * 1000 / 3600)); // seconds
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Generate random number in range
export const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
