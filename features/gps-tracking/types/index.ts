// Types for Live GPS Bus Tracking Feature

// === GPS Position ===
export interface GPSPosition {
  lat: number;
  lng: number;
  timestamp: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  altitude?: number;
}

// === Vehicle Status ===
export type VehicleStatus = 'moving' | 'stopped' | 'boarding' | 'waiting' | 'delayed' | 'traffic' | 'completed' | 'offline';

// === Bus Entity ===
export interface Bus {
  id: string;
  number: string;
  routeId: string;
  routeName: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  occupancy: number;
  status: VehicleStatus;
  currentSpeed: number;
  averageSpeed: number;
  batteryLevel: number;
  lastGPSUpdate: number;
  gpsSignal: 'strong' | 'weak' | 'lost';
  eta?: string;
  nextStop?: string;
  safetyScore: number;
  color: string;
}

// === Bus Stop ===
export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  scheduledTime: string;
  estimatedArrival?: string;
  dwellTime?: number; // seconds
  order: number;
}

// === Route ===
export interface BusRoute {
  id: string;
  name: string;
  color: string;
  stops: BusStop[];
  totalDistance: number; // meters
  estimatedDuration: number; // seconds
}

// === Driver ===
export interface Driver {
  id: string;
  name: string;
  license: string;
  experience: string;
  safetyScore: number;
  totalTrips: number;
  phone: string;
  busId?: string;
}

// === GPS Event Types ===
export interface GPSUpdate {
  position: GPSPosition;
  busId: string;
}

export interface RouteProgress {
  currentStopIndex: number;
  completedStops: number;
  remainingStops: number;
  completedDistance: number; // meters
  remainingDistance: number; // meters
  totalDistance: number; // meters
  progressPercentage: number;
  estimatedTimeRemaining: number; // seconds
}

// === Trip State ===
export interface TripState {
  isActive: boolean;
  startTime?: number;
  endTime?: number;
  distanceTraveled: number;
  duration: number;
  currentStopIndex: number;
  currentSpeed: number;
  averageSpeed: number;
  status: VehicleStatus;
}

// === Map View State ===
export interface MapViewState {
  center: { lat: number; lng: number };
  zoom: number;
  bearing: number;
  pitch: number;
  followsBus: boolean;
  showRoute: boolean;
  showStops: boolean;
  showHistory: boolean;
  satelliteMode: boolean;
}

// === Tracking Controls ===
export interface TrackingControlsState {
  isPlaying: boolean;
  speedMultiplier: number;
  lastUpdate: number;
}

// === Real-time Updates ===
export type GPSUpdateCallback = (update: GPSUpdate) => void;

// === Mock GPS Service Config ===
export interface MockGPSConfig {
  speed: number; // meters per second
  updateInterval: number; // milliseconds
  simulationSpeedMultiplier: number;
  randomVariance: number;
}

// === Service Layer ===
export interface IGPSRepository {
  // Bus operations
  getBus(busId: string): Promise<Bus | null>;
  getAllBuses(): Promise<Bus[]>;
  
  // Route operations
  getRoute(routeId: string): Promise<BusRoute | null>;
  getCurrentRoute(busId: string): Promise<BusRoute | null>;
  
  // Driver operations
  getDriver(driverId: string): Promise<Driver | null>;
  
  // GPS tracking
  startTracking(busId: string, callback: GPSUpdateCallback): () => void;
  stopTracking(busId: string): void;
  getCurrentPosition(busId: string): GPSPosition | null;
  
  // Trip control (Driver)
  startTrip(busId: string): Promise<boolean>;
  pauseTrip(busId: string): Promise<boolean>;
  resumeTrip(busId: string): Promise<boolean>;
  endTrip(busId: string): Promise<boolean>;
  
  // Admin operations
  getFleetStatus(): Promise<{
    totalBuses: number;
    activeBuses: number;
    offlineBuses: number;
    delayedBuses: number;
    averageFleetSpeed: number;
  }>;
}
