// GPS Service - High-level service layer for GPS operations
// Handles business logic, simulation, and state management

import { IGPSRepository, Bus, BusRoute, GPSPosition, VehicleStatus, MapViewState, TrackingControlsState, TrafficCondition, LiveBusState } from '../types/index';
import { gpsRepository } from './GPSRepository';
import { mockRoutes } from '../mock/routes';
import { mockBuses } from '../mock/vehicles';
import { calculateDistance, calculateBearing } from '../utils/math';

const DEFAULT_UPDATE_INTERVAL = 1000; // 1 second
const MAX_HISTORY_SIZE = 100;
const SIMULATION_SPEED_METERS_PER_SECOND = 40;

class GPSService {
  private repository: IGPSRepository;
  private updateInterval: number;
  private simulationInterval: NodeJS.Timeout | null = null;
  private trackingCallbacks: Map<string, ((update: GPSPosition) => void)[]> = new Map();
  private busHistory: Map<string, GPSPosition[]> = new Map();
  private busPositions: Map<string, GPSPosition> = new Map();
  private currentRouteIndex: Map<string, number> = new Map();
  private liveBusStates: Map<string, LiveBusState> = new Map();
  private trafficConditions: Map<string, TrafficCondition> = new Map();
  private mapViewState: MapViewState = {
    center: { lat: 11.0168, lng: 76.9558 },
    zoom: 14,
    bearing: 0,
    pitch: 0,
    followsBus: true,
    showRoute: true,
    showStops: true,
    showHistory: false,
    satelliteMode: false,
  };
  private controlsState: TrackingControlsState = {
    isPlaying: true,
    speedMultiplier: 1,
    lastUpdate: Date.now(),
  };

  constructor(repository: IGPSRepository = gpsRepository, updateInterval: number = DEFAULT_UPDATE_INTERVAL) {
    this.repository = repository;
    this.updateInterval = updateInterval;
    this.initializeBusPositionsFromRepository();
    this.initializeBusHistory();
    this.initializeLiveBusStates();
  }

  private initializeBusPositionsFromRepository() {
    // Initialize positions from repository's currentPositions
    mockBuses.forEach(bus => {
      const route = mockRoutes[bus.routeId as keyof typeof mockRoutes];
      const firstStop = route?.stops[0];
      const position: GPSPosition = {
        lat: firstStop?.lat || 11.0168,
        lng: firstStop?.lng || 76.9558,
        timestamp: Date.now(),
        speed: bus.currentSpeed,
        heading: 0,
      };
      this.busPositions.set(bus.id, position);
      this.currentRouteIndex.set(bus.id, 0);
    });
  }

  private initializeBusHistory() {
    // Initialize empty history for each bus
    mockBuses.forEach(bus => {
      this.busHistory.set(bus.id, []);
    });
  }

  private initializeLiveBusStates() {
    // Initialize live bus states with traffic conditions
    mockBuses.forEach(bus => {
      const position = this.busPositions.get(bus.id);
      if (position) {
        const trafficCondition = this.generateTrafficCondition();
        this.trafficConditions.set(bus.id, trafficCondition);
        
        const liveState: LiveBusState = {
          busId: bus.id,
          position,
          lastSeen: Date.now(),
          driverId: bus.driverId,
          trafficCondition,
        };
        this.liveBusStates.set(bus.id, liveState);
      }
    });
  }

  private generateTrafficCondition(): TrafficCondition {
    // Simulated traffic condition - can be replaced with real traffic API
    const rand = Math.random();
    let state: 'clear' | 'moderate' | 'heavy' = 'clear';
    let factor = 1.0;
    let reason: string | undefined;

    if (rand > 0.9) {
      state = 'heavy';
      factor = 0.4;
      reason = 'Heavy congestion';
    } else if (rand > 0.7) {
      state = 'moderate';
      factor = 0.7;
      reason = 'Moderate traffic';
    }

    return {
      state,
      factor,
      reason,
      lastUpdated: Date.now(),
    };
  }

  private updateTrafficCondition(busId: string) {
    // Update traffic condition periodically (simulated)
    const rand = Math.random();
    if (rand > 0.95) { // 5% chance to change traffic state
      const newCondition = this.generateTrafficCondition();
      this.trafficConditions.set(busId, newCondition);
      
      // Update live bus state
      const liveState = this.liveBusStates.get(busId);
      if (liveState) {
        liveState.trafficCondition = newCondition;
        this.liveBusStates.set(busId, liveState);
      }
    }
  }

  // Start/Stop simulation
  startSimulation() {
    this.controlsState.isPlaying = true;
    this.simulationInterval = setInterval(() => {
      this.simulateGPSMovement();
      this.updateAllPositions();
    }, this.updateInterval);
  }

  stopSimulation() {
    this.controlsState.isPlaying = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  restartSimulation() {
    this.stopSimulation();
    this.startSimulation();
  }

  setSimulationSpeed(multiplier: number) {
    this.controlsState.speedMultiplier = multiplier;
    const newInterval = Math.max(100, this.updateInterval / multiplier);
    this.updateInterval = newInterval;
    
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = setInterval(() => {
        this.simulateGPSMovement();
        this.updateAllPositions();
      }, newInterval);
    }
  }

  // Simulate GPS movement for all buses
  private simulateGPSMovement() {
    mockBuses.forEach(bus => {
      const position = this.busPositions.get(bus.id);
      if (!position) return;
      
      // Get route for this bus
      const route = mockRoutes[bus.routeId as keyof typeof mockRoutes];
      if (!route || route.stops.length < 2) return;
      
      // Find current segment
      let currentIndex = this.currentRouteIndex.get(bus.id) || 0;
      currentIndex = Math.min(currentIndex, route.stops.length - 2);
      
      const start = route.stops[currentIndex];
      const end = route.stops[currentIndex + 1];
      
      if (!start || !end) return;
      
      // Calculate distance between stops
      const segmentDistance = calculateDistance(start.lat, start.lng, end.lat, end.lng);
      
      // Calculate speed in degrees per update
      const metersPerSecond = SIMULATION_SPEED_METERS_PER_SECOND * (1 + Math.random() * 0.2); // 20% variance
      const metersPerUpdate = metersPerSecond * (this.updateInterval / 1000) * this.controlsState.speedMultiplier;
      
      // Calculate progress along segment
      const progress = metersPerUpdate / segmentDistance;
      
      // Update position
      const newLat = start.lat + (end.lat - start.lat) * progress;
      const newLng = start.lng + (end.lng - start.lng) * progress;
      
      // Calculate heading
      const heading = calculateBearing(start.lat, start.lng, end.lat, end.lng);
      
      // Create new position
      const newPosition: GPSPosition = {
        lat: newLat,
        lng: newLng,
        timestamp: Date.now(),
        speed: Math.round(metersPerSecond * 3.6), // Convert to km/h
        heading: Math.round(heading),
        accuracy: 3,
      };
      
      this.busPositions.set(bus.id, newPosition);
      
      // Check if bus reached end of segment
      if (progress >= 1) {
        this.currentRouteIndex.set(bus.id, currentIndex + 1);
      }
      
      // Update history
      this.updateBusHistory(bus.id, newPosition);
    });
  }

  // Position updates
  private updateAllPositions() {
    if (!this.controlsState.isPlaying) return;

    // Notify all listeners
    this.trackingCallbacks.forEach((callbacks, busId) => {
      const position = this.busPositions.get(busId);
      if (position) {
        callbacks.forEach(cb => cb(position));
      }
    });
  }

  private updateBusHistory(busId: string, position: GPSPosition) {
    let history = this.busHistory.get(busId) || [];
    history.push(position);
    
    // Keep only last 100 positions
    if (history.length > MAX_HISTORY_SIZE) {
      history = history.slice(-MAX_HISTORY_SIZE);
    }
    
    this.busHistory.set(busId, history);
  }

  // Get positions
  getBusPosition(busId: string): GPSPosition | null {
    return this.busPositions.get(busId) || null;
  }

  getBusHistory(busId: string): GPSPosition[] {
    return this.busHistory.get(busId) || [];
  }

  // Route calculations
  calculateRouteDistance(routeId: string): number {
    const route = mockRoutes[routeId as keyof typeof mockRoutes];
    if (!route) return 0;
    
    let distance = 0;
    for (let i = 0; i < route.stops.length - 1; i++) {
      distance += calculateDistance(
        route.stops[i].lat,
        route.stops[i].lng,
        route.stops[i + 1].lat,
        route.stops[i + 1].lng
      );
    }
    
    return Math.round(distance);
  }

  calculateETA(busId: string, targetStopIndex?: number): { etaSeconds: number; etaText: string; trafficCondition?: TrafficCondition; nextStopETA?: { etaSeconds: number; etaText: string } } {
    const position = this.getBusPosition(busId);
    const bus = mockBuses.find(b => b.id === busId);
    
    if (!position || !bus) {
      return { etaSeconds: 0, etaText: 'N/A' };
    }

    const currentSpeed = position.speed || 0;
    
    if (currentSpeed <= 0) {
      return { etaSeconds: 0, etaText: 'Stopped' };
    }

    // Get route distance
    const route = mockRoutes[bus.routeId as keyof typeof mockRoutes];
    const totalDistance = route ? this.calculateRouteDistance(bus.routeId) : 8500;
    
    // Calculate remaining distance based on current route index
    const currentIndex = this.currentRouteIndex.get(busId) || 0;
    const targetIndex = targetStopIndex !== undefined ? targetStopIndex : route?.stops.length - 1 || 4;
    const stopsRemaining = targetIndex - currentIndex;
    const remainingDistance = (stopsRemaining / (route?.stops.length - 1 || 5)) * totalDistance;
    
    // Get traffic condition
    const trafficCondition = this.trafficConditions.get(busId);
    const trafficFactor = trafficCondition?.factor || 1.0;
    
    // Calculate ETA with traffic factor based on route segment
    const baseSpeed = currentSpeed * 1000 / 3600; // Convert km/h to m/s
    const adjustedSpeed = baseSpeed * trafficFactor;
    const travelTime = remainingDistance / adjustedSpeed; // Convert to seconds
    
    // Calculate ETA to next stop if target is not the next stop
    let nextStopETA;
    if (targetIndex > currentIndex + 1) {
      const nextStopDistance = (1 / (route?.stops.length - 1 || 5)) * totalDistance;
      const nextStopTime = nextStopDistance / adjustedSpeed;
      nextStopETA = {
        etaSeconds: Math.round(nextStopTime),
        etaText: this.formatDuration(Math.round(nextStopTime))
      };
    }
    
    return {
      etaSeconds: Math.round(travelTime),
      etaText: this.formatDuration(Math.round(travelTime)),
      trafficCondition,
      nextStopETA
    };
  }

  formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }

  // Tracking callbacks
  subscribeToUpdates(busId: string, callback: (position: GPSPosition) => void): () => void {
    if (!this.trackingCallbacks.has(busId)) {
      this.trackingCallbacks.set(busId, []);
    }
    
    this.trackingCallbacks.get(busId)?.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.trackingCallbacks.get(busId);
      if (callbacks) {
        this.trackingCallbacks.set(
          busId,
          callbacks.filter(cb => cb !== callback)
        );
      }
    };
  }

  // Map view state
  getMapViewState(): MapViewState {
    return { ...this.mapViewState };
  }

  setMapViewState(newState: Partial<MapViewState>) {
    this.mapViewState = { ...this.mapViewState, ...newState };
  }

  toggleFollowBus() {
    this.mapViewState.followsBus = !this.mapViewState.followsBus;
  }

  toggleShowRoute() {
    this.mapViewState.showRoute = !this.mapViewState.showRoute;
  }

  toggleShowStops() {
    this.mapViewState.showStops = !this.mapViewState.showStops;
  }

  toggleShowHistory() {
    this.mapViewState.showHistory = !this.mapViewState.showHistory;
  }

  toggleSatelliteMode() {
    this.mapViewState.satelliteMode = !this.mapViewState.satelliteMode;
  }

  // Trip control
  async startTrip(busId: string): Promise<boolean> {
    return this.repository.startTrip(busId);
  }

  async pauseTrip(busId: string): Promise<boolean> {
    return this.repository.pauseTrip(busId);
  }

  async resumeTrip(busId: string): Promise<boolean> {
    return this.repository.resumeTrip(busId);
  }

  async endTrip(busId: string): Promise<boolean> {
    return this.repository.endTrip(busId);
  }

  // Bus info
  async getBusInfo(busId: string): Promise<Bus | null> {
    return this.repository.getBus(busId);
  }

  async getAllBuses(): Promise<Bus[]> {
    return this.repository.getAllBuses();
  }

  // Route info
  async getRouteInfo(routeId: string): Promise<BusRoute | null> {
    return this.repository.getRoute(routeId);
  }

  // Fleet status
  async getFleetStatus() {
    return this.repository.getFleetStatus();
  }

  // Update bus position (for external GPS updates)
  updateBusPosition(busId: string, position: GPSPosition, driverId?: string, activeTripId?: string): void {
    this.busPositions.set(busId, position);
    
    const liveState = this.liveBusStates.get(busId);
    if (liveState) {
      liveState.position = position;
      liveState.lastSeen = Date.now();
      if (driverId) liveState.driverId = driverId;
      if (activeTripId) liveState.activeTripId = activeTripId;
      this.liveBusStates.set(busId, liveState);
    }
    
    this.updateBusHistory(busId, position);
  }

  // Get route progress for a bus
  getRouteProgress(busId: string): { currentStopIndex: number; completedStops: number; remainingStops: number; progressPercentage: number; currentStop?: any; nextStop?: any } {
    const currentIndex = this.currentRouteIndex.get(busId) || 0;
    const bus = mockBuses.find(b => b.id === busId);
    const route = bus ? mockRoutes[bus.routeId as keyof typeof mockRoutes] : null;
    
    if (!route) {
      return {
        currentStopIndex: currentIndex,
        completedStops: currentIndex,
        remainingStops: 0,
        progressPercentage: 0
      };
    }

    const totalStops = route.stops.length;
    const completedStops = currentIndex;
    const remainingStops = totalStops - 1 - currentIndex;
    const progressPercentage = (currentIndex / (totalStops - 1)) * 100;

    return {
      currentStopIndex: currentIndex,
      completedStops,
      remainingStops,
      progressPercentage: Math.round(progressPercentage),
      currentStop: route.stops[currentIndex],
      nextStop: route.stops[currentIndex + 1]
    };
  }

  // Get traffic condition for a bus
  getTrafficCondition(busId: string): TrafficCondition | null {
    return this.trafficConditions.get(busId) || null;
  }

  // Get live bus state
  getLiveBusState(busId: string): LiveBusState | null {
    return this.liveBusStates.get(busId) || null;
  }

  // Get all live bus states
  getAllLiveBusStates(): LiveBusState[] {
    return Array.from(this.liveBusStates.values());
  }
}

// Export singleton instance
export const gpsService = new GPSService();
