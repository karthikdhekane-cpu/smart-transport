// GPS Repository Implementation
// This is the repository layer that abstracts GPS data sources
// Can be replaced with Firebase, REST API, GraphQL, MQTT, or WebSockets later

import { IGPSRepository, Bus, BusRoute, BusStop, Driver, GPSPosition, GPSUpdate, GPSUpdateCallback, VehicleStatus } from '../types/index';
import { mockBuses, mockDrivers, fleetSummary, getBusById, getDriverById, getFleetStatus } from '../mock/vehicles';
import { mockRoutes, getDefaultRoute } from '../mock/routes';
import { COLLEGE_REFERENCE, generateRoutePoints } from '../mock/gps-data';

// In-memory cache for GPS positions
const currentPositions: Record<string, GPSPosition> = {};
const busRoutes: Record<string, GPSPosition[]> = {};
const busStatus: Record<string, VehicleStatus> = {};

// Initialize mock routes for each bus
const initializeRoutes = () => {
  mockBuses.forEach(bus => {
    busStatus[bus.id] = bus.status;
    const route = mockRoutes[bus.routeId as keyof typeof mockRoutes];
    if (route) {
      busRoutes[bus.id] = route.stops.map((stop: any, index: number) => ({
        lat: stop.lat,
        lng: stop.lng,
        timestamp: Date.now() - (route.stops.length - index) * 1000 * 60, // 1 minute intervals
        speed: 40 + Math.sin(index * 0.2) * 10,
      }));
    }
  });
};

// Calculate bearing between two points
const calculateBearing = (startLat: number, startLng: number, endLat: number, endLng: number): number => {
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

// Interpolate position between two points
const interpolatePosition = (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  progress: number
): GPSPosition => {
  return {
    lat: startLat + (endLat - startLat) * progress,
    lng: startLng + (endLng - startLng) * progress,
    timestamp: Date.now(),
    speed: 40 + Math.random() * 10,
    heading: calculateBearing(startLat, startLng, endLat, endLng),
  };
};

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
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

// Calculate route progress
const calculateRouteProgress = (busId: string): { progress: number; currentStopIndex: number; remainingDistance: number } => {
  const positions = busRoutes[busId];
  if (!positions || positions.length < 2) return { progress: 0, currentStopIndex: 0, remainingDistance: 0 };

  const currentPos = currentPositions[busId];
  if (!currentPos) return { progress: 0, currentStopIndex: 0, remainingDistance: 0 };

  let totalDistance = 0;
  let completedDistance = 0;

  for (let i = 0; i < positions.length - 1; i++) {
    const segmentDistance = calculateDistance(positions[i].lat, positions[i].lng, positions[i + 1].lat, positions[i + 1].lng);
    totalDistance += segmentDistance;

    if (i < positions.length - 2) {
      completedDistance += segmentDistance;
    }
  }

  return { progress: (completedDistance / totalDistance) * 100, currentStopIndex: positions.length - 2, remainingDistance: totalDistance - completedDistance };
};

class GPSRepository implements IGPSRepository {
  constructor() {
    initializeRoutes();
    // Initialize initial positions
    mockBuses.forEach(bus => {
      currentPositions[bus.id] = {
        lat: busRoutes[bus.id]?.[0]?.lat || 11.0168,
        lng: busRoutes[bus.id]?.[0]?.lng || 76.9558,
        timestamp: Date.now(),
        speed: bus.currentSpeed,
      };
    });
  }

  // Bus operations
  async getBus(busId: string): Promise<Bus | null> {
    const bus = getBusById(busId);
    if (!bus) return null;

    const position = currentPositions[busId];
    const routeProgress = calculateRouteProgress(busId);

    return {
      ...bus,
      currentSpeed: position?.speed || 0,
      lastGPSUpdate: position?.timestamp || Date.now(),
    };
  }

  async getAllBuses(): Promise<Bus[]> {
    return mockBuses.map(bus => ({
      ...bus,
      currentSpeed: currentPositions[bus.id]?.speed || bus.currentSpeed,
      lastGPSUpdate: currentPositions[bus.id]?.timestamp || Date.now(),
    }));
  }

  // Route operations
  async getRoute(routeId: string): Promise<BusRoute | null> {
    return mockRoutes[routeId as keyof typeof mockRoutes] || null;
  }

  async getCurrentRoute(busId: string): Promise<BusRoute | null> {
    const bus = getBusById(busId);
    if (!bus) return null;
    return this.getRoute(bus.routeId);
  }

  // Driver operations
  async getDriver(driverId: string): Promise<Driver | null> {
    return getDriverById(driverId) || null;
  }

  // GPS tracking
  private listeners: Record<string, GPSUpdateCallback[]> = {};

  startTracking(busId: string, callback: GPSUpdateCallback): () => void {
    if (!this.listeners[busId]) {
      this.listeners[busId] = [];
    }

    this.listeners[busId].push(callback);

    // Send initial position
    const position = currentPositions[busId];
    if (position) {
      callback({ position, busId });
    }

    // Return unsubscribe function
    return () => {
      this.listeners[busId] = this.listeners[busId].filter(l => l !== callback);
    };
  }

  stopTracking(busId: string): void {
    delete this.listeners[busId];
  }

  getCurrentPosition(busId: string): GPSPosition | null {
    return currentPositions[busId] || null;
  }

  // Simulate GPS updates (in real implementation, this would come from MQTT/WebSocket)
  simulateUpdates(): void {
    mockBuses.forEach((bus: any) => {
      const positions = busRoutes[bus.id];
      if (!positions || positions.length < 2) return;

      // Move to next position in route
      const currentPos = currentPositions[bus.id] || positions[0];
      let currentIndex = positions.findIndex(p => p.lat === currentPos.lat && p.lng === currentPos.lng);
      if (currentIndex === -1) currentIndex = 0;

      const nextIndex = (currentIndex + 1) % positions.length;
      const nextPos = positions[nextIndex];

      // Interpolate between current and next
      const progress = (Date.now() % 5000) / 5000; // 5 seconds per segment
      const interpolatedPos = interpolatePosition(
        currentPos.lat,
        currentPos.lng,
        nextPos.lat,
        nextPos.lng,
        progress
      );

      currentPositions[bus.id] = interpolatedPos;

      // Notify listeners
      if (this.listeners[bus.id]) {
        this.listeners[bus.id].forEach((callback: any) => callback({ position: interpolatedPos, busId: bus.id }));
      }
    });
  }

  // Trip control
  async startTrip(busId: string): Promise<boolean> {
    const bus = getBusById(busId);
    if (!bus) return false;

    busStatus[busId] = 'moving';
    return true;
  }

  async pauseTrip(busId: string): Promise<boolean> {
    const bus = getBusById(busId);
    if (!bus) return false;

    busStatus[busId] = 'stopped';
    return true;
  }

  async resumeTrip(busId: string): Promise<boolean> {
    const bus = getBusById(busId);
    if (!bus) return false;

    busStatus[busId] = 'moving';
    return true;
  }

  async endTrip(busId: string): Promise<boolean> {
    const bus = getBusById(busId);
    if (!bus) return false;

    busStatus[busId] = 'completed';
    return true;
  }

  // Admin operations
  async getFleetStatus(): Promise<{
    totalBuses: number;
    activeBuses: number;
    offlineBuses: number;
    delayedBuses: number;
    averageFleetSpeed: number;
  }> {
    return getFleetStatus();
  }
}

// Export singleton instance
export const gpsRepository = new GPSRepository();

