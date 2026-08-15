// Route Scheduling Service - Automatic route scheduling with conflict detection
// Handles bus/driver assignment, trip scheduling, and conflict prevention

import { mockBuses, mockRoutes, mockDrivers } from '@/lib/mockData';

export interface ScheduledTrip {
  id: string;
  routeId: string;
  routeName: string;
  busId: string;
  driverId: string;
  startTime: number; // Unix timestamp
  endTime: number; // Unix timestamp
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export interface ScheduleConflict {
  type: 'bus' | 'driver';
  resourceId: string;
  conflictingTrips: string[];
  message: string;
}

export interface RouteScheduleStatus {
  routeId: string;
  routeName: string;
  busId?: string;
  driverId?: string;
  nextTrip?: ScheduledTrip;
  status: 'unscheduled' | 'scheduled' | 'active';
  conflicts?: ScheduleConflict[];
}

class RouteSchedulingService {
  private scheduledTrips: Map<string, ScheduledTrip> = new Map();
  private routeAssignments: Map<string, string> = new Map(); // routeId -> busId
  private driverAssignments: Map<string, string> = new Map(); // routeId -> driverId

  constructor() {
    this.initializeFromMockData();
  }

  private initializeFromMockData() {
    // Initialize with existing mock data assignments
    mockRoutes.forEach(route => {
      const bus = mockBuses.find(b => b.id === route.busId);
      if (bus) {
        this.routeAssignments.set(route.id, bus.id);
        
        const driver = mockDrivers.find(d => d.busId === bus.id);
        if (driver) {
          this.driverAssignments.set(route.id, driver.id);
        }
      }
    });
  }

  // Assign a bus to a route
  assignBusToRoute(routeId: string, busId: string): { success: boolean; conflict?: ScheduleConflict } {
    // Check if bus is already assigned to another route
    const existingRoute = Array.from(this.routeAssignments.entries())
      .find(([_, assignedBusId]) => assignedBusId === busId);
    
    if (existingRoute && existingRoute[0] !== routeId) {
      return {
        success: false,
        conflict: {
          type: 'bus',
          resourceId: busId,
          conflictingTrips: [existingRoute[0]],
          message: `Bus ${busId} is already assigned to route ${existingRoute[0]}`
        }
      };
    }

    this.routeAssignments.set(routeId, busId);
    return { success: true };
  }

  // Assign a driver to a route
  assignDriverToRoute(routeId: string, driverId: string): { success: boolean; conflict?: ScheduleConflict } {
    // Check if driver is already assigned to another route
    const existingRoute = Array.from(this.driverAssignments.entries())
      .find(([_, assignedDriverId]) => assignedDriverId === driverId);
    
    if (existingRoute && existingRoute[0] !== routeId) {
      return {
        success: false,
        conflict: {
          type: 'driver',
          resourceId: driverId,
          conflictingTrips: [existingRoute[0]],
          message: `Driver ${driverId} is already assigned to route ${existingRoute[0]}`
        }
      };
    }

    this.driverAssignments.set(routeId, driverId);
    return { success: true };
  }

  // Schedule a trip with conflict detection
  scheduleTrip(
    routeId: string,
    busId: string,
    driverId: string,
    startTime: number,
    estimatedDuration: number
  ): { success: boolean; tripId?: string; conflicts?: ScheduleConflict[] } {
    const conflicts: ScheduleConflict[] = [];
    const endTime = startTime + estimatedDuration;

    // Check bus availability for time window
    const busTrips = Array.from(this.scheduledTrips.values())
      .filter(trip => trip.busId === busId && trip.status !== 'cancelled');
    
    for (const trip of busTrips) {
      if (this.timeRangesOverlap(startTime, endTime, trip.startTime, trip.endTime)) {
        conflicts.push({
          type: 'bus',
          resourceId: busId,
          conflictingTrips: [trip.id],
          message: `Bus ${busId} has overlapping trip ${trip.id} during this time window`
        });
      }
    }

    // Check driver availability for time window
    const driverTrips = Array.from(this.scheduledTrips.values())
      .filter(trip => trip.driverId === driverId && trip.status !== 'cancelled');
    
    for (const trip of driverTrips) {
      if (this.timeRangesOverlap(startTime, endTime, trip.startTime, trip.endTime)) {
        conflicts.push({
          type: 'driver',
          resourceId: driverId,
          conflictingTrips: [trip.id],
          message: `Driver ${driverId} has overlapping trip ${trip.id} during this time window`
        });
      }
    }

    if (conflicts.length > 0) {
      return { success: false, conflicts };
    }

    // Create the trip
    const tripId = `TRIP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const route = mockRoutes.find(r => r.id === routeId);
    
    const trip: ScheduledTrip = {
      id: tripId,
      routeId,
      routeName: route?.name || 'Unknown Route',
      busId,
      driverId,
      startTime,
      endTime,
      status: 'scheduled'
    };

    this.scheduledTrips.set(tripId, trip);
    this.routeAssignments.set(routeId, busId);
    this.driverAssignments.set(routeId, driverId);

    return { success: true, tripId };
  }

  // Check if two time ranges overlap
  private timeRangesOverlap(start1: number, end1: number, start2: number, end2: number): boolean {
    return start1 < end2 && end1 > start2;
  }

  // Get route schedule status
  getRouteScheduleStatus(routeId: string): RouteScheduleStatus {
    const route = mockRoutes.find(r => r.id === routeId);
    if (!route) {
      return {
        routeId,
        routeName: 'Unknown Route',
        status: 'unscheduled'
      };
    }

    const busId = this.routeAssignments.get(routeId);
    const driverId = this.driverAssignments.get(routeId);

    // Find next scheduled or active trip for this route
    const now = Date.now();
    const nextTrip = Array.from(this.scheduledTrips.values())
      .filter(trip => trip.routeId === routeId && (trip.status === 'scheduled' || trip.status === 'active'))
      .sort((a, b) => a.startTime - b.startTime)[0];

    const status = nextTrip ? (nextTrip.status === 'active' ? 'active' : 'scheduled') : 'unscheduled';

    return {
      routeId,
      routeName: route.name,
      busId,
      driverId,
      nextTrip,
      status
    };
  }

  // Get all route schedule statuses
  getAllRouteScheduleStatuses(): RouteScheduleStatus[] {
    return mockRoutes.map(route => this.getRouteScheduleStatus(route.id));
  }

  // Cancel a trip
  cancelTrip(tripId: string): boolean {
    const trip = this.scheduledTrips.get(tripId);
    if (!trip) return false;

    trip.status = 'cancelled';
    this.scheduledTrips.set(tripId, trip);
    return true;
  }

  // Start a trip
  startTrip(tripId: string): boolean {
    const trip = this.scheduledTrips.get(tripId);
    if (!trip || trip.status !== 'scheduled') return false;

    trip.status = 'active';
    this.scheduledTrips.set(tripId, trip);
    return true;
  }

  // Complete a trip
  completeTrip(tripId: string): boolean {
    const trip = this.scheduledTrips.get(tripId);
    if (!trip) return false;

    trip.status = 'completed';
    trip.endTime = Date.now();
    this.scheduledTrips.set(tripId, trip);
    return true;
  }

  // Get all scheduled trips
  getAllScheduledTrips(): ScheduledTrip[] {
    return Array.from(this.scheduledTrips.values());
  }

  // Get trips for a specific bus
  getTripsForBus(busId: string): ScheduledTrip[] {
    return Array.from(this.scheduledTrips.values())
      .filter(trip => trip.busId === busId);
  }

  // Get trips for a specific driver
  getTripsForDriver(driverId: string): ScheduledTrip[] {
    return Array.from(this.scheduledTrips.values())
      .filter(trip => trip.driverId === driverId);
  }
}

// Export singleton instance
export const routeSchedulingService = new RouteSchedulingService();
