// Route Scheduling Service - Automatic route scheduling with bus/driver assignment and conflict detection

import { mockBuses, mockDrivers } from '../../gps-tracking/mock/vehicles';
import { mockRoutes } from '../../gps-tracking/mock/routes';

export interface ScheduledTrip {
  id: string;
  routeId: string;
  routeName: string;
  busId: string;
  busNumber: string;
  driverId: string;
  driverName: string;
  startTime: number; // timestamp
  endTime: number; // timestamp
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export interface Conflict {
  type: 'bus' | 'driver';
  conflictingTripId: string;
  conflictingTrip: ScheduledTrip;
  newTrip: Partial<ScheduledTrip>;
  reason: string;
}

class RouteSchedulingService {
  private scheduledTrips: Map<string, ScheduledTrip> = new Map();
  private busAssignments: Map<string, string> = new Map(); // busId -> tripId
  private driverAssignments: Map<string, string> = new Map(); // driverId -> tripId

  constructor() {
    this.initializeFromMockData();
  }

  private initializeFromMockData() {
    // Initialize with some default scheduled trips from mock data
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const routeArray = Object.values(mockRoutes);
    
    // Create initial scheduled trips
    mockBuses.slice(0, 2).forEach((bus, index) => {
      const route = routeArray[index];
      const driver = mockDrivers[index];
      
      if (route && driver) {
        const trip: ScheduledTrip = {
          id: `trip-${bus.id}-${Date.now()}`,
          routeId: route.id,
          routeName: route.name,
          busId: bus.id,
          busNumber: bus.number,
          driverId: driver.id,
          driverName: driver.name,
          startTime: now + (index * 2 * hour),
          endTime: now + (index * 2 * hour) + hour,
          status: 'scheduled'
        };
        
        this.scheduledTrips.set(trip.id, trip);
        this.busAssignments.set(bus.id, trip.id);
        this.driverAssignments.set(driver.id, trip.id);
      }
    });
  }

  // Check for conflicts when assigning a bus
  checkBusConflict(busId: string, startTime: number, endTime: number, excludeTripId?: string): Conflict | null {
    const existingTripId = this.busAssignments.get(busId);
    
    if (!existingTripId) return null;
    if (excludeTripId && existingTripId === excludeTripId) return null;
    
    const existingTrip = this.scheduledTrips.get(existingTripId);
    if (!existingTrip) return null;
    
    // Check for time overlap
    if (startTime < existingTrip.endTime && endTime > existingTrip.startTime) {
      return {
        type: 'bus',
        conflictingTripId: existingTripId,
        conflictingTrip: existingTrip,
        newTrip: { busId },
        reason: `Bus ${busId} is already assigned to trip ${existingTripId} during this time period`
      };
    }
    
    return null;
  }

  // Check for conflicts when assigning a driver
  checkDriverConflict(driverId: string, startTime: number, endTime: number, excludeTripId?: string): Conflict | null {
    const existingTripId = this.driverAssignments.get(driverId);
    
    if (!existingTripId) return null;
    if (excludeTripId && existingTripId === excludeTripId) return null;
    
    const existingTrip = this.scheduledTrips.get(existingTripId);
    if (!existingTrip) return null;
    
    // Check for time overlap
    if (startTime < existingTrip.endTime && endTime > existingTrip.startTime) {
      return {
        type: 'driver',
        conflictingTripId: existingTripId,
        conflictingTrip: existingTrip,
        newTrip: { driverId },
        reason: `Driver ${driverId} is already assigned to trip ${existingTripId} during this time period`
      };
    }
    
    return null;
  }

  // Check for all conflicts
  checkAllConflicts(busId: string, driverId: string, startTime: number, endTime: number, excludeTripId?: string): Conflict[] {
    const conflicts: Conflict[] = [];
    
    const busConflict = this.checkBusConflict(busId, startTime, endTime, excludeTripId);
    if (busConflict) conflicts.push(busConflict);
    
    const driverConflict = this.checkDriverConflict(driverId, startTime, endTime, excludeTripId);
    if (driverConflict) conflicts.push(driverConflict);
    
    return conflicts;
  }

  // Assign bus to route
  assignBusToRoute(routeId: string, busId: string, driverId: string, startTime: number, durationHours: number = 1): { success: boolean; tripId?: string; conflicts?: Conflict[] } {
    const routeArray = Object.values(mockRoutes);
    const route = routeArray.find((r: any) => r.id === routeId);
    const bus = mockBuses.find((b: any) => b.id === busId);
    const driver = mockDrivers.find((d: any) => d.id === driverId);
    
    if (!route || !bus || !driver) {
      return { success: false };
    }
    
    const endTime = startTime + (durationHours * 60 * 60 * 1000);
    
    // Check for conflicts
    const conflicts = this.checkAllConflicts(busId, driverId, startTime, endTime);
    
    if (conflicts.length > 0) {
      return { success: false, conflicts };
    }
    
    // Create scheduled trip
    const trip: ScheduledTrip = {
      id: `trip-${busId}-${Date.now()}`,
      routeId,
      routeName: route.name,
      busId,
      busNumber: bus.number,
      driverId,
      driverName: driver.name,
      startTime,
      endTime,
      status: 'scheduled'
    };
    
    this.scheduledTrips.set(trip.id, trip);
    this.busAssignments.set(busId, trip.id);
    this.driverAssignments.set(driverId, trip.id);
    
    return { success: true, tripId: trip.id };
  }

  // Get route schedule status
  getRouteSchedule(routeId: string): ScheduledTrip[] {
    return Array.from(this.scheduledTrips.values())
      .filter(trip => trip.routeId === routeId)
      .sort((a, b) => a.startTime - b.startTime);
  }

  // Get all scheduled trips
  getAllScheduledTrips(): ScheduledTrip[] {
    return Array.from(this.scheduledTrips.values())
      .sort((a, b) => a.startTime - b.startTime);
  }

  // Get trip by ID
  getTrip(tripId: string): ScheduledTrip | null {
    return this.scheduledTrips.get(tripId) || null;
  }

  // Cancel trip
  cancelTrip(tripId: string): boolean {
    const trip = this.scheduledTrips.get(tripId);
    if (!trip) return false;
    
    trip.status = 'cancelled';
    this.scheduledTrips.set(tripId, trip);
    
    // Remove assignments
    this.busAssignments.delete(trip.busId);
    this.driverAssignments.delete(trip.driverId);
    
    return true;
  }

  // Start trip
  startTrip(tripId: string): boolean {
    const trip = this.scheduledTrips.get(tripId);
    if (!trip || trip.status !== 'scheduled') return false;
    
    trip.status = 'active';
    this.scheduledTrips.set(tripId, trip);
    
    return true;
  }

  // Complete trip
  completeTrip(tripId: string): boolean {
    const trip = this.scheduledTrips.get(tripId);
    if (!trip || trip.status !== 'active') return false;
    
    trip.status = 'completed';
    this.scheduledTrips.set(tripId, trip);
    
    // Remove assignments
    this.busAssignments.delete(trip.busId);
    this.driverAssignments.delete(trip.driverId);
    
    return true;
  }

  // Get available buses (not currently assigned to active trips)
  getAvailableBuses(): any[] {
    const activeBusIds = Array.from(this.busAssignments.entries())
      .filter(([_, tripId]) => {
        const trip = this.scheduledTrips.get(tripId);
        return trip && (trip.status === 'active' || trip.status === 'scheduled');
      })
      .map(([busId]) => busId);
    
    return mockBuses.filter(bus => !activeBusIds.includes(bus.id));
  }

  // Get available drivers (not currently assigned to active trips)
  getAvailableDrivers(): any[] {
    const activeDriverIds = Array.from(this.driverAssignments.entries())
      .filter(([_, tripId]) => {
        const trip = this.scheduledTrips.get(tripId);
        return trip && (trip.status === 'active' || trip.status === 'scheduled');
      })
      .map(([driverId]) => driverId);
    
    return mockDrivers.filter((driver: any) => !activeDriverIds.includes(driver.id));
  }
}

// Export singleton instance
export const routeSchedulingService = new RouteSchedulingService();
