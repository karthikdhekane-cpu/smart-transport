// Route scheduling service for route assignments, trip scheduling, and conflict prevention.

import { mockBuses, mockDrivers, mockRoutes } from '@/lib/mockData';

export interface ScheduledTrip {
  id: string;
  routeId: string;
  routeName: string;
  busId: string;
  busNumber: string;
  driverId: string;
  driverName: string;
  startTime: number;
  endTime: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export interface ScheduleConflict {
  type: 'bus' | 'driver';
  resourceId: string;
  conflictingTrips: string[];
  message: string;
  conflictingTripId: string;
  conflictingTrip: ScheduledTrip;
  newTrip: Partial<ScheduledTrip>;
  reason: string;
}

// Retained as the detailed conflict name used by the live ETA work.
export type Conflict = ScheduleConflict;

export interface RouteScheduleStatus {
  routeId: string;
  routeName: string;
  busId?: string;
  driverId?: string;
  nextTrip?: ScheduledTrip;
  status: 'unscheduled' | 'scheduled' | 'active';
  conflicts?: ScheduleConflict[];
}

type AssignmentResult = { success: boolean; conflict?: ScheduleConflict };
type TripResult = { success: boolean; tripId?: string; conflicts?: ScheduleConflict[] };

class RouteSchedulingService {
  private scheduledTrips = new Map<string, ScheduledTrip>();
  private routeAssignments = new Map<string, string>();
  private routeDriverAssignments = new Map<string, string>();

  constructor() {
    this.initializeFromMockData();
  }

  private initializeFromMockData() {
    const now = Date.now();
    const hour = 60 * 60 * 1000;

    mockRoutes.forEach((route, index) => {
      const bus = mockBuses.find(candidate => candidate.id === route.busId);
      const driver = bus && mockDrivers.find(candidate => candidate.busId === bus.id);

      if (!bus || !driver) return;

      this.routeAssignments.set(route.id, bus.id);
      this.routeDriverAssignments.set(route.id, driver.id);

      const trip: ScheduledTrip = {
        id: `trip-${bus.id}-${index}`,
        routeId: route.id,
        routeName: route.name,
        busId: bus.id,
        busNumber: bus.number,
        driverId: driver.id,
        driverName: driver.name,
        startTime: now + index * 2 * hour,
        endTime: now + (index * 2 + 1) * hour,
        status: 'scheduled',
      };

      this.scheduledTrips.set(trip.id, trip);
    });
  }

  private timeRangesOverlap(startA: number, endA: number, startB: number, endB: number) {
    return startA < endB && endA > startB;
  }

  private createConflict(
    type: 'bus' | 'driver',
    resourceId: string,
    conflictingTrip: ScheduledTrip,
    newTrip: Partial<ScheduledTrip>,
  ): ScheduleConflict {
    const label = type === 'bus' ? 'Bus' : 'Driver';

    return {
      type,
      resourceId,
      conflictingTrips: [conflictingTrip.id],
      message: `${label} ${resourceId} has an overlapping trip ${conflictingTrip.id}`,
      conflictingTripId: conflictingTrip.id,
      conflictingTrip,
      newTrip,
      reason: `${label} ${resourceId} is already assigned to trip ${conflictingTrip.id} during this time period`,
    };
  }

  checkBusConflict(busId: string, startTime: number, endTime: number, excludeTripId?: string): Conflict | null {
    const conflictingTrip = Array.from(this.scheduledTrips.values()).find(trip =>
      trip.busId === busId
      && trip.id !== excludeTripId
      && trip.status !== 'cancelled'
      && this.timeRangesOverlap(startTime, endTime, trip.startTime, trip.endTime),
    );

    return conflictingTrip
      ? this.createConflict('bus', busId, conflictingTrip, { busId, startTime, endTime })
      : null;
  }

  checkDriverConflict(driverId: string, startTime: number, endTime: number, excludeTripId?: string): Conflict | null {
    const conflictingTrip = Array.from(this.scheduledTrips.values()).find(trip =>
      trip.driverId === driverId
      && trip.id !== excludeTripId
      && trip.status !== 'cancelled'
      && this.timeRangesOverlap(startTime, endTime, trip.startTime, trip.endTime),
    );

    return conflictingTrip
      ? this.createConflict('driver', driverId, conflictingTrip, { driverId, startTime, endTime })
      : null;
  }

  checkAllConflicts(
    busId: string,
    driverId: string,
    startTime: number,
    endTime: number,
    excludeTripId?: string,
  ): Conflict[] {
    return [
      this.checkBusConflict(busId, startTime, endTime, excludeTripId),
      this.checkDriverConflict(driverId, startTime, endTime, excludeTripId),
    ].filter((conflict): conflict is Conflict => conflict !== null);
  }

  assignBusToRoute(routeId: string, busId: string): AssignmentResult;
  assignBusToRoute(routeId: string, busId: string, driverId: string, startTime: number, durationHours?: number): TripResult;
  assignBusToRoute(
    routeId: string,
    busId: string,
    driverId?: string,
    startTime?: number,
    durationHours = 1,
  ): AssignmentResult | TripResult {
    if (driverId !== undefined && startTime !== undefined) {
      return this.scheduleTrip(routeId, busId, driverId, startTime, durationHours * 60 * 60 * 1000);
    }

    const existingRoute = Array.from(this.routeAssignments.entries())
      .find(([assignedRouteId, assignedBusId]) => assignedBusId === busId && assignedRouteId !== routeId);

    if (existingRoute) {
      const conflictingTrip = this.getRouteSchedule(existingRoute[0])[0];
      if (conflictingTrip) {
        return { success: false, conflict: this.createConflict('bus', busId, conflictingTrip, { routeId, busId }) };
      }
    }

    this.routeAssignments.set(routeId, busId);
    return { success: true };
  }

  assignDriverToRoute(routeId: string, driverId: string): AssignmentResult {
    const existingRoute = Array.from(this.routeDriverAssignments.entries())
      .find(([assignedRouteId, assignedDriverId]) => assignedDriverId === driverId && assignedRouteId !== routeId);

    if (existingRoute) {
      const conflictingTrip = this.getRouteSchedule(existingRoute[0])[0];
      if (conflictingTrip) {
        return { success: false, conflict: this.createConflict('driver', driverId, conflictingTrip, { routeId, driverId }) };
      }
    }

    this.routeDriverAssignments.set(routeId, driverId);
    return { success: true };
  }

  scheduleTrip(
    routeId: string,
    busId: string,
    driverId: string,
    startTime: number,
    estimatedDuration: number,
  ): TripResult {
    const route = mockRoutes.find(candidate => candidate.id === routeId);
    const bus = mockBuses.find(candidate => candidate.id === busId);
    const driver = mockDrivers.find(candidate => candidate.id === driverId);

    if (!route || !bus || !driver) return { success: false };

    const endTime = startTime + estimatedDuration;
    const conflicts = this.checkAllConflicts(busId, driverId, startTime, endTime);
    if (conflicts.length > 0) return { success: false, conflicts };

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
      status: 'scheduled',
    };

    this.scheduledTrips.set(trip.id, trip);
    this.routeAssignments.set(routeId, busId);
    this.routeDriverAssignments.set(routeId, driverId);
    return { success: true, tripId: trip.id };
  }

  getRouteScheduleStatus(routeId: string): RouteScheduleStatus {
    const route = mockRoutes.find(candidate => candidate.id === routeId);
    if (!route) return { routeId, routeName: 'Unknown Route', status: 'unscheduled' };

    const nextTrip = this.getRouteSchedule(routeId)
      .find(trip => trip.status === 'scheduled' || trip.status === 'active');

    return {
      routeId,
      routeName: route.name,
      busId: this.routeAssignments.get(routeId),
      driverId: this.routeDriverAssignments.get(routeId),
      nextTrip,
      status: nextTrip?.status === 'active' ? 'active' : nextTrip ? 'scheduled' : 'unscheduled',
    };
  }

  getAllRouteScheduleStatuses(): RouteScheduleStatus[] {
    return mockRoutes.map(route => this.getRouteScheduleStatus(route.id));
  }

  getRouteSchedule(routeId: string): ScheduledTrip[] {
    return Array.from(this.scheduledTrips.values())
      .filter(trip => trip.routeId === routeId)
      .sort((left, right) => left.startTime - right.startTime);
  }

  getAllScheduledTrips(): ScheduledTrip[] {
    return Array.from(this.scheduledTrips.values())
      .sort((left, right) => left.startTime - right.startTime);
  }

  getTrip(tripId: string): ScheduledTrip | null {
    return this.scheduledTrips.get(tripId) || null;
  }

  getTripsForBus(busId: string): ScheduledTrip[] {
    return this.getAllScheduledTrips().filter(trip => trip.busId === busId);
  }

  getTripsForDriver(driverId: string): ScheduledTrip[] {
    return this.getAllScheduledTrips().filter(trip => trip.driverId === driverId);
  }

  cancelTrip(tripId: string): boolean {
    const trip = this.scheduledTrips.get(tripId);
    if (!trip) return false;

    trip.status = 'cancelled';
    this.scheduledTrips.set(tripId, trip);
    return true;
  }

  startTrip(tripId: string): boolean {
    const trip = this.scheduledTrips.get(tripId);
    if (!trip || trip.status !== 'scheduled') return false;

    trip.status = 'active';
    this.scheduledTrips.set(tripId, trip);
    return true;
  }

  completeTrip(tripId: string): boolean {
    const trip = this.scheduledTrips.get(tripId);
    if (!trip || trip.status !== 'active') return false;

    trip.status = 'completed';
    this.scheduledTrips.set(tripId, trip);
    return true;
  }

  getAvailableBuses(): typeof mockBuses {
    const assignedBusIds = new Set(
      this.getAllScheduledTrips()
        .filter(trip => trip.status === 'scheduled' || trip.status === 'active')
        .map(trip => trip.busId),
    );

    return mockBuses.filter(bus => !assignedBusIds.has(bus.id));
  }

  getAvailableDrivers(): typeof mockDrivers {
    const assignedDriverIds = new Set(
      this.getAllScheduledTrips()
        .filter(trip => trip.status === 'scheduled' || trip.status === 'active')
        .map(trip => trip.driverId),
    );

    return mockDrivers.filter(driver => !assignedDriverIds.has(driver.id));
  }
}

export const routeSchedulingService = new RouteSchedulingService();
