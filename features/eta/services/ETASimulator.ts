// ETA Simulator - Simulates bus movement and ETA calculations
// This is the core simulation engine for the Dynamic ETA system

import { BusETAState, Position, RouteInfo, StopInfo, TrafficLevel, TrafficLevelConfig, BusStatus, DelayReason, DelayState, TrafficState } from '../types';
import { TRAFFIC_LEVELS, getRandomTrafficLevel } from '../mock/traffic';
import { calculateDistance, calculateBearing, interpolatePosition } from '../utils/math';
import { calculateETAToStop } from '../utils/etaCalculator';

// Constants
const SIMULATION_UPDATE_INTERVAL = 2000; // 2 seconds
const MIN_SPEED_KMH = 5;
const MAX_SPEED_KMH = 60;
const BASE_SPEED_VARIANCE = 0.2; // ±20% variance

// Helper to generate random traffic delay with variance
function generateTrafficDelay(trafficLevel: TrafficLevel): number {
  const config = TRAFFIC_LEVELS[trafficLevel];
  return Math.floor(config.delayMinutes * (0.8 + Math.random() * 0.4)); // ±20% variance
}

// Helper to determine bus status based on position and route
function determineBusStatus(
  remainingDistance: number,
  currentSpeed: number,
  currentStop: StopInfo | undefined,
  nextStop: StopInfo | undefined,
  delayMinutes: number
): BusStatus {
  if (remainingDistance <= 50) return 'arriving'; // Within 50m
  if (remainingDistance <= 200) return 'approaching'; // Within 200m
  if (currentSpeed < 5 && currentStop) return 'waiting';
  if (delayMinutes >= 10) return 'heavy-traffic';
  if (delayMinutes > 0) return 'delayed';
  return 'on-time';
}

// Simulate bus position updates
export class ETASimulator {
  private busStates: Map<string, BusETAState> = new Map();
  private simulationInterval: NodeJS.Timeout | null = null;

  // Initialize bus state from mock data
  initializeBusState(busId: string, routeInfo: RouteInfo, currentStop?: StopInfo, nextStop?: StopInfo): void {
    // Get initial position from current stop
    const position: Position = currentStop
      ? {
          lat: currentStop.lat,
          lng: currentStop.lng,
          timestamp: Date.now(),
          speed: 40 + Math.random() * 10,
          heading: 0,
        }
      : {
          lat: routeInfo.stops[0]?.lat || 11.0168,
          lng: routeInfo.stops[0]?.lng || 76.9558,
          timestamp: Date.now(),
          speed: 40,
          heading: 0,
        };

    // Initialize traffic state
    const initialTrafficLevel = getRandomTrafficLevel();
    const trafficState: TrafficState = {
      level: initialTrafficLevel,
      config: TRAFFIC_LEVELS[initialTrafficLevel],
      lastChanged: Date.now(),
    };

    // Initialize delay state
    const delayState: DelayState = {
      active: false,
      minutes: 0,
      reason: 'none',
    };

    // Calculate initial ETA
    const remainingDistance = routeInfo.totalDistance * (1 - (routeInfo.progressPercentage || 0) / 100);
    const etaSeconds = calculateETAToStop(
      remainingDistance,
      position.speed,
      trafficState.config.speedMultiplier,
      delayState.minutes
    );

    const eta: BusETAState = {
      busId,
      currentETA: {
        seconds: etaSeconds,
        text: this.formatETA(etaSeconds),
        scheduledTime: routeInfo.stops[routeInfo.stops.length - 1]?.scheduledTime,
        predictedTime: this.calculatePredictedTime(etaSeconds),
        delayMinutes: 0,
        delayReason: 'none',
      },
      routeInfo: { ...routeInfo, progressPercentage: routeInfo.progressPercentage || 0 },
      status: 'on-time',
      traffic: trafficState,
      delay: delayState,
      speed: position.speed,
      position,
      currentStop,
      nextStop,
      lastUpdated: Date.now(),
    };

    this.busStates.set(busId, eta);
  }

  // Get current bus ETA state
  getBusState(busId: string): BusETAState | undefined {
    return this.busStates.get(busId);
  }

  // Get all bus states
  getAllBusStates(): BusETAState[] {
    return Array.from(this.busStates.values());
  }

  // Start simulation
  startSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }

    this.simulationInterval = setInterval(() => {
      this.updateAllBuses();
    }, SIMULATION_UPDATE_INTERVAL);
  }

  // Stop simulation
  stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  // Update all buses
  private updateAllBuses(): void {
    this.busStates.forEach((state, busId) => {
      this.updateBusState(busId);
    });
  }

  // Update single bus state with immutable updates
  private updateBusState(busId: string): void {
    const state = this.busStates.get(busId);
    if (!state) return;

    const now = Date.now();
    
    // Update traffic state with state-based transition
    const timeSinceChange = now - state.traffic.lastChanged;
    const newTrafficLevel = timeSinceChange > 30000 && Math.random() < 0.3
      ? getRandomTrafficLevel()
      : state.traffic.level;
    
    const newTrafficState: TrafficState = {
      level: newTrafficLevel,
      config: TRAFFIC_LEVELS[newTrafficLevel],
      lastChanged: newTrafficLevel !== state.traffic.level ? now : state.traffic.lastChanged,
    };

    // Update position - move bus along route based on speed
    const currentProgress = state.routeInfo.progressPercentage || 0;
    
    // Speed calculation with traffic multiplier and variance
    const speedVariance = (Math.random() * 2 - 1) * BASE_SPEED_VARIANCE; // -0.2 to +0.2
    const effectiveSpeedMultiplier = newTrafficState.config.speedMultiplier;
    const speedKmh = Math.max(MIN_SPEED_KMH, Math.min(MAX_SPEED_KMH, 
      state.speed * (1 + speedVariance) * effectiveSpeedMultiplier
    ));
    
    // Calculate progress increase based on speed
    // speedKmh km/h = speedKmh / 3.6 m/s
    // In 2 seconds: (speedKmh / 3.6) * 2 meters
    const metersPerUpdate = (speedKmh / 3.6) * (SIMULATION_UPDATE_INTERVAL / 1000);
    const totalRouteDistance = state.routeInfo.totalDistance || 1;
    const progressIncrease = (metersPerUpdate / totalRouteDistance) * 100;
    
    const newProgress = Math.min(100, currentProgress + progressIncrease);

    // Get current and next stop based on progress
    const stops = state.routeInfo.stops;
    const totalStops = stops.length;
    const stopIndex = Math.floor((newProgress / 100) * (totalStops - 1));
    const newIndex = Math.min(Math.max(0, stopIndex), totalStops - 2);
    const nextIndex = Math.min(newIndex + 1, totalStops - 1);

    const currentStop = stops[newIndex];
    const nextStop = stops[nextIndex];

    // Calculate remaining distance
    const remainingDistance = state.routeInfo.totalDistance * (1 - newProgress / 100);

    // Calculate delay based on traffic
    const delayMinutes = newTrafficState.config.delayMinutes;
    const newDelayState: DelayState = {
      active: delayMinutes > 0,
      minutes: delayMinutes,
      reason: delayMinutes > 0 ? 'traffic' : 'none',
      startTime: delayMinutes > 0 && !state.delay.active ? now : state.delay.startTime,
    };

    // Calculate new ETA
    const etaSeconds = calculateETAToStop(
      remainingDistance,
      speedKmh,
      newTrafficState.config.speedMultiplier,
      delayMinutes
    );

    // Determine status
    const status = determineBusStatus(remainingDistance, speedKmh, currentStop, nextStop, delayMinutes);

    // Interpolate position between current and next stop
    const segmentProgress = (newProgress % (100 / (totalStops - 1))) / (100 / (totalStops - 1));
    const heading = currentStop && nextStop
      ? calculateBearing(currentStop.lat, currentStop.lng, nextStop.lat, nextStop.lng)
      : state.position.heading;

    const interpolatedPos = currentStop && nextStop
      ? interpolatePosition(currentStop.lat, currentStop.lng, nextStop.lat, nextStop.lng, segmentProgress)
      : state.position;

    const interpolatedPosition: Position = {
      lat: interpolatedPos.lat,
      lng: interpolatedPos.lng,
      timestamp: now,
      speed: Math.round(speedKmh),
      heading: Math.round(heading),
    };

    // Create new bus state with immutable updates
    const updatedState: BusETAState = {
      busId,
      currentETA: {
        seconds: etaSeconds,
        text: this.formatETA(etaSeconds),
        scheduledTime: state.routeInfo.stops[state.routeInfo.stops.length - 1]?.scheduledTime,
        predictedTime: this.calculatePredictedTime(etaSeconds),
        delayMinutes: Math.round(delayMinutes),
        delayReason: newDelayState.reason,
      },
      routeInfo: {
        id: state.routeInfo.id,
        name: state.routeInfo.name,
        color: state.routeInfo.color,
        totalDistance: state.routeInfo.totalDistance,
        estimatedDuration: state.routeInfo.estimatedDuration,
        stops: state.routeInfo.stops,
        completedStops: newIndex,
        remainingStops: totalStops - 1 - newIndex,
        progressPercentage: newProgress,
      },
      status,
      traffic: newTrafficState,
      delay: newDelayState,
      speed: Math.round(speedKmh),
      position: interpolatedPosition,
      currentStop,
      nextStop,
      previousStop: newIndex > 0 ? stops[newIndex - 1] : undefined,
      lastUpdated: now,
    };

    this.busStates.set(busId, updatedState);
  }

  // Format ETA for display
  private formatETA(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }

  // Calculate predicted arrival time
  private calculatePredictedTime(etaSeconds: number): string {
    const predictedDate = new Date(Date.now() + etaSeconds * 1000);
    return predictedDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  // Update bus position manually (for external control)
  updatePosition(busId: string, position: Position): void {
    const state = this.busStates.get(busId);
    if (state) {
      this.busStates.set(busId, {
        ...state,
        position,
        lastUpdated: Date.now(),
      });
    }
  }

  // Force status update
  updateStatus(busId: string, status: BusStatus): void {
    const state = this.busStates.get(busId);
    if (state) {
      this.busStates.set(busId, {
        ...state,
        status,
        lastUpdated: Date.now(),
      });
    }
  }

  // Get traffic config
  getTrafficConfig(): Record<TrafficLevel, TrafficLevelConfig> {
    return TRAFFIC_LEVELS;
  }

  // Get active traffic levels
  getActiveTrafficLevels(): TrafficLevel[] {
    return Object.keys(TRAFFIC_LEVELS) as TrafficLevel[];
  }

  // Cleanup
  cleanup(): void {
    this.stopSimulation();
    this.busStates.clear();
  }
}

// Export singleton instance
export const etaSimulator = new ETASimulator();
