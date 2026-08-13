// Mock GPS Simulation Data
import { GPSPosition } from '../types';

// Coimbatore College Area - Reference Point
export const COLLEGE_REFERENCE = {
  lat: 11.0168,
  lng: 76.9558,
  bounds: {
    minLat: 11.005,
    maxLat: 11.035,
    minLng: 76.940,
    maxLng: 76.985,
  },
};

// Generate smooth route points for a route
export function generateRoutePoints(
  routePoints: number,
  baseLat: number,
  baseLng: number,
  direction: 'north' | 'east' | 'northeast' = 'north',
  spacing: number = 0.0008
): GPSPosition[] {
  const positions: GPSPosition[] = [];
  let lat = baseLat;
  let lng = baseLng;

  for (let i = 0; i < routePoints; i++) {
    positions.push({
      lat,
      lng,
      timestamp: Date.now() - (routePoints - i) * 1000 * 60, // 1 minute intervals
      speed: 40 + Math.sin(i * 0.2) * 10,
    });

    switch (direction) {
      case 'north':
        lat += spacing;
        break;
      case 'east':
        lng += spacing;
        break;
      case 'northeast':
        lat += spacing * 0.7;
        lng += spacing * 0.7;
        break;
    }
  }

  return positions;
}

// GPS history for a bus
export const busGPSHistory: Record<string, GPSPosition[]> = {
  'BUS-01': generateRoutePoints(50, 11.0168, 76.9558, 'northeast'),
  'BUS-02': generateRoutePoints(40, 11.0068, 76.9458, 'northeast'),
  'BUS-03': generateRoutePoints(45, 11.0098, 76.9458, 'east'),
  'BUS-04': generateRoutePoints(35, 11.0318, 76.9758, 'north'),
};

// Traffic delay zones (mock)
export const trafficZones = [
  {
    id: 'tz-1',
    lat: 11.0128,
    lng: 76.9518,
    radius: 0.003,
    severity: 'high',
    delayMinutes: 8,
  },
  {
    id: 'tz-2',
    lat: 11.0258,
    lng: 76.9648,
    radius: 0.002,
    severity: 'medium',
    delayMinutes: 4,
  },
];

// Weather conditions (mock)
export const weatherConditions = {
  temperature: 28,
  humidity: 65,
  condition: 'partly-cloudy',
  visibility: 'good',
};
