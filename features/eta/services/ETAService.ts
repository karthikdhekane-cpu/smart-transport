// ETA Service - High-level service for Dynamic ETA operations
// Handles business logic and coordinates with repository

import { BusETAState, RouteInfo, StopInfo } from '../types';
import { etaSimulator } from './ETASimulator';
import { mockRoutes } from '../mock/routes';
import { mockBuses } from '../mock/vehicles';

class ETAService {
  private simulator: typeof etaSimulator;

  constructor(simulator = etaSimulator) {
    this.simulator = simulator;
  }

  // Initialize all buses with ETA states
  initializeAllBuses(): void {
    mockBuses.forEach(bus => {
      const route = mockRoutes[bus.routeId as keyof typeof mockRoutes];
      if (route) {
        const routeInfo: RouteInfo = {
          id: route.id,
          name: route.name,
          color: route.color,
          totalDistance: route.totalDistance,
          estimatedDuration: route.estimatedDuration,
          stops: route.stops.map((stop, index) => ({
            id: stop.id,
            name: stop.name,
            lat: stop.lat,
            lng: stop.lng,
            scheduledTime: stop.scheduledTime,
            dwellTime: stop.dwellTime,
            order: stop.order,
            distanceRemaining: 0,
            isCompleted: false,
            isCurrent: false,
            isNext: false,
          })),
          completedStops: 0,
          remainingStops: route.stops.length - 1,
          progressPercentage: 0,
        };

        // Convert BusStop to StopInfo
        const firstStop: StopInfo = {
          id: route.stops[0].id,
          name: route.stops[0].name,
          lat: route.stops[0].lat,
          lng: route.stops[0].lng,
          scheduledTime: route.stops[0].scheduledTime,
          dwellTime: route.stops[0].dwellTime,
          order: route.stops[0].order,
          distanceRemaining: 0,
          isCompleted: true,
          isCurrent: true,
          isNext: false,
        };

        const secondStop: StopInfo = {
          id: route.stops[1].id,
          name: route.stops[1].name,
          lat: route.stops[1].lat,
          lng: route.stops[1].lng,
          scheduledTime: route.stops[1].scheduledTime,
          dwellTime: route.stops[1].dwellTime,
          order: route.stops[1].order,
          distanceRemaining: 0,
          isCompleted: false,
          isCurrent: false,
          isNext: true,
        };

        this.simulator.initializeBusState(bus.id, routeInfo, firstStop, secondStop);
      }
    });
  }

  // Start ETA simulation
  startSimulation(): void {
    this.simulator.startSimulation();
  }

  // Stop ETA simulation
  stopSimulation(): void {
    this.simulator.stopSimulation();
  }

  // Get all bus ETA states
  getAllBusStates(): BusETAState[] {
    return this.simulator.getAllBusStates();
  }

  // Get bus ETA by ID
  getBusETA(busId: string): BusETAState | undefined {
    return this.simulator.getBusState(busId);
  }

  // Get fleet ETA summary for admin dashboard
  getFleetETASummary() {
    const states = this.simulator.getAllBusStates();
    
    return {
      totalBuses: states.length,
      activeBuses: states.filter(s => s.status !== 'completed').length,
      onTimeBuses: states.filter(s => s.status === 'on-time').length,
      delayedBuses: states.filter(s => s.status === 'delayed' || s.status === 'heavy-traffic').length,
      averageETA: states.length > 0 ? states.reduce((sum, s) => sum + s.currentETA.seconds, 0) / states.length : 0,
      averageSpeed: states.length > 0 ? states.reduce((sum, s) => sum + s.speed, 0) / states.length : 0,
    };
  }

  // Format ETA for display
  formatETA(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }

  // Calculate delay reason text
  getDelayReasonText(reason: string): string {
    const reasons: Record<string, string> = {
      traffic: 'Traffic congestion',
      'road-work': 'Road work ahead',
      signal: 'Signal delay',
      'student-boarding': 'Student boarding',
      rain: 'Weather conditions',
      accident: 'Accident reported',
      none: '',
    };
    return reasons[reason] || 'Unknown delay';
  }

  // Cleanup
  cleanup(): void {
    this.simulator.cleanup();
  }
}

// Export singleton instance
export const etaService = new ETAService();

// Initialize buses on module load - only on client side to avoid SSR issues
if (typeof window !== 'undefined') {
  etaService.initializeAllBuses();
}
