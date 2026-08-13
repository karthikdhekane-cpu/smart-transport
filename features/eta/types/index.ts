// ETA Types for Dynamic ETA System

// === Bus Stop (for ETA feature) ===
export interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  scheduledTime: string;
  estimatedArrival?: string;
  dwellTime?: number;
  order: number;
}

// === Bus Route (for ETA feature) ===
export interface BusRoute {
  id: string;
  name: string;
  color: string;
  totalDistance: number;
  estimatedDuration: number;
  stops: BusStop[];
}

// === Traffic Levels ===
export type TrafficLevel = 'very-low' | 'low' | 'medium' | 'high' | 'heavy';

export interface TrafficLevelConfig {
  name: string;
  speedMultiplier: number;
  delayMinutes: number;
  color: string;
  icon: string;
}

// === Bus Status ===
export type BusStatus = 'on-time' | 'approaching' | 'arriving' | 'waiting' | 'departed' | 'delayed' | 'heavy-traffic' | 'completed';

// === Delay Types ===
export type DelayReason = 'traffic' | 'road-work' | 'signal' | 'student-boarding' | 'rain' | 'accident' | 'none';

// === Position ===
export interface Position {
  lat: number;
  lng: number;
  timestamp: number;
  speed: number;
  heading: number;
}

// === Stop Info ===
export interface StopInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
  scheduledTime: string;
  estimatedArrival?: string;
  dwellTime?: number;
  order: number;
  distanceRemaining: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

// === Route Info ===
export interface RouteInfo {
  id: string;
  name: string;
  color: string;
  totalDistance: number; // meters
  estimatedDuration: number; // seconds
  stops: StopInfo[];
  completedStops: number;
  remainingStops: number;
  progressPercentage: number;
}

// === ETA Calculation Inputs ===
export interface ETACalculationInputs {
  remainingDistance: number; // meters
  currentSpeed: number; // km/h
  averageRouteSpeed: number; // km/h
  trafficMultiplier: number;
  roadDelayMinutes: number;
  boardingDelayMinutes: number;
  signalDelayMinutes: number;
  busStatus: BusStatus;
}

// === Computed ETA ===
export interface ComputedETA {
  seconds: number;
  text: string;
  scheduledTime?: string;
  predictedTime?: string;
  delayMinutes: number;
  delayReason: DelayReason;
}

// === Traffic Simulation State ===
export interface TrafficState {
  level: TrafficLevel;
  config: TrafficLevelConfig;
  lastChanged: number;
  nextRandomChange?: number;
}

// === Delay State ===
export interface DelayState {
  active: boolean;
  minutes: number;
  reason: DelayReason;
  startTime?: number;
  expectedEnd?: number;
}

// === Bus ETA State ===
export interface BusETAState {
  busId: string;
  currentETA: ComputedETA;
  routeInfo: RouteInfo;
  status: BusStatus;
  traffic: TrafficState;
  delay: DelayState;
  speed: number;
  position: Position;
  currentStop?: StopInfo;
  nextStop?: StopInfo;
  previousStop?: StopInfo;
  lastUpdated: number;
}
