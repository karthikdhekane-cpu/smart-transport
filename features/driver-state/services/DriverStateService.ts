// Driver State Service - Centralized state management for driver operations
// Handles driver status, availability, and attendance tracking

import { IDriverStateService, DriverStatus, DriverAvailability, DriverSession, AttendanceRecord, Geofence, Alert, RouteDeviation, UnauthorizedStop } from '../types/index';
import { driverSessions, attendanceRecords, geofences, alerts, routeDeviations, unauthorizedStops } from '../mock/data';

// Storage keys
const STORAGE_KEYS = {
  DRIVER_STATUS: 'campbus_driver_status',
  DRIVER_AVAILABILITY: 'campbus_driver_availability',
  DRIVER_SESSIONS: 'campbus_driver_sessions',
  ATTENDANCE_RECORDS: 'campbus_attendance_records',
  GEOFENCES: 'campbus_geofences',
  ALERTS: 'campbus_alerts',
  ROUTE_DEVIATIONS: 'campbus_route_deviations',
  UNAUTHORIZED_STOPS: 'campbus_unauthorized_stops',
};

// In-memory storage
let driverStatus: Record<string, DriverStatus> = {};
let driverAvailability: Record<string, DriverAvailability> = {};
let sessions: Record<string, DriverSession> = {};
let storedAttendanceRecords: AttendanceRecord[] = [];
let storedGeofences: Geofence[] = [];
let storedAlerts: Alert[] = [];
let storedRouteDeviations: Record<string, RouteDeviation> = {};
let storedUnauthorizedStops: Record<string, UnauthorizedStop> = {};

// Browser environment check
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Load from localStorage on init - browser only
function loadFromStorage() {
  if (!isBrowser) return;

  try {
    const storedDriverStatus = localStorage.getItem(STORAGE_KEYS.DRIVER_STATUS);
    const storedDriverAvailability = localStorage.getItem(STORAGE_KEYS.DRIVER_AVAILABILITY);
    const storedSessions = localStorage.getItem(STORAGE_KEYS.DRIVER_SESSIONS);
    const storedAttendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS);
    const storedGeofencesLocal = localStorage.getItem(STORAGE_KEYS.GEOFENCES);
    const storedAlertsLocal = localStorage.getItem(STORAGE_KEYS.ALERTS);
    const storedRouteDeviationsLocal = localStorage.getItem(STORAGE_KEYS.ROUTE_DEVIATIONS);
    const storedUnauthorizedStopsLocal = localStorage.getItem(STORAGE_KEYS.UNAUTHORIZED_STOPS);

    if (storedDriverStatus) driverStatus = JSON.parse(storedDriverStatus);
    if (storedDriverAvailability) driverAvailability = JSON.parse(storedDriverAvailability);
    if (storedSessions) sessions = JSON.parse(storedSessions);
    if (storedAttendance) storedAttendanceRecords = JSON.parse(storedAttendance);
    if (storedGeofencesLocal) storedGeofences = JSON.parse(storedGeofencesLocal);
    if (storedAlertsLocal) storedAlerts = JSON.parse(storedAlertsLocal);
    if (storedRouteDeviationsLocal) storedRouteDeviations = JSON.parse(storedRouteDeviationsLocal);
    if (storedUnauthorizedStopsLocal) storedUnauthorizedStops = JSON.parse(storedUnauthorizedStopsLocal);
  } catch (e) {
    // Silent fail for SSR - use initial data
  }

  // Initialize with mock data if empty
  if (Object.keys(driverStatus).length === 0) {
    Object.keys(driverSessions).forEach(driverId => {
      driverStatus[driverId] = driverSessions[driverId].status;
      driverAvailability[driverId] = driverSessions[driverId].availability;
    });
  }
  if (Object.keys(sessions).length === 0) {
    Object.assign(sessions, driverSessions);
  }
  if (storedAttendanceRecords.length === 0) {
    storedAttendanceRecords = [...attendanceRecords];
  }
  if (storedGeofences.length === 0) {
    storedGeofences = [...geofences];
  }
  if (storedAlerts.length === 0) {
    storedAlerts = [...alerts];
  }
  if (Object.keys(storedRouteDeviations).length === 0) {
    Object.assign(storedRouteDeviations, routeDeviations);
  }
  if (Object.keys(storedUnauthorizedStops).length === 0) {
    Object.assign(storedUnauthorizedStops, unauthorizedStops);
  }
}

function saveToStorage() {
  if (!isBrowser) return;

  try {
    localStorage.setItem(STORAGE_KEYS.DRIVER_STATUS, JSON.stringify(driverStatus));
    localStorage.setItem(STORAGE_KEYS.DRIVER_AVAILABILITY, JSON.stringify(driverAvailability));
    localStorage.setItem(STORAGE_KEYS.DRIVER_SESSIONS, JSON.stringify(sessions));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(storedAttendanceRecords));
    localStorage.setItem(STORAGE_KEYS.GEOFENCES, JSON.stringify(storedGeofences));
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(storedAlerts));
    localStorage.setItem(STORAGE_KEYS.ROUTE_DEVIATIONS, JSON.stringify(storedRouteDeviations));
    localStorage.setItem(STORAGE_KEYS.UNAUTHORIZED_STOPS, JSON.stringify(storedUnauthorizedStops));
  } catch (e) {
    // Silent fail for SSR
  }
}

class DriverStateService implements IDriverStateService {
  constructor() {
    loadFromStorage();
  }

  // === Driver Status Methods ===

  getDriverStatus(driverId: string): DriverStatus {
    return driverStatus[driverId] || 'idle';
  }

  setDriverStatus(driverId: string, status: DriverStatus): boolean {
    if (!driverId) return false;
    
    driverStatus[driverId] = status;
    
    // Update session if exists
    if (sessions[driverId]) {
      sessions[driverId] = {
        ...sessions[driverId],
        status,
      };
    }
    
    saveToStorage();
    return true;
  }

  // === Driver Availability Methods ===

  getDriverAvailability(driverId: string): DriverAvailability {
    return driverAvailability[driverId] || 'available';
  }

  setDriverAvailability(driverId: string, availability: DriverAvailability): boolean {
    if (!driverId) return false;
    
    driverAvailability[driverId] = availability;
    
    // Update session if exists
    if (sessions[driverId]) {
      sessions[driverId] = {
        ...sessions[driverId],
        availability,
      };
    }
    
    saveToStorage();
    return true;
  }

  // === Session Management Methods ===

  getCurrentSession(driverId: string): DriverSession | null {
    return sessions[driverId] || null;
  }

  startSession(driverId: string, busId?: string): boolean {
    if (!driverId) return false;

    sessions[driverId] = {
      driverId,
      busId,
      status: 'idle',
      availability: 'available',
      startTime: Date.now(),
    };

    // Set initial status and availability
    driverStatus[driverId] = 'idle';
    driverAvailability[driverId] = 'available';

    saveToStorage();
    return true;
  }

  endSession(driverId: string): boolean {
    if (!sessions[driverId]) return false;

    sessions[driverId] = {
      ...sessions[driverId],
      endTime: Date.now(),
      status: 'idle',
    };

    saveToStorage();
    return true;
  }

  // === Attendance Methods ===

  getAllAttendanceRecords(): AttendanceRecord[] {
    return [...storedAttendanceRecords].sort((a, b) => b.timestamp - a.timestamp);
  }

  getAttendanceByBus(busId: string): AttendanceRecord[] {
    return this.getAllAttendanceRecords().filter(r => r.busId === busId);
  }

  getAttendanceByStudent(studentId: string): AttendanceRecord[] {
    return this.getAllAttendanceRecords().filter(r => r.studentId === studentId);
  }

  createAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'timestamp'>): string {
    // Check for duplicate scan
    if (record.scanId && this.checkDuplicateScan(record.scanId)) {
      throw new Error('Duplicate attendance scan detected');
    }

    const id = `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRecord: AttendanceRecord = {
      ...record,
      id,
      timestamp: Date.now(),
    };

    storedAttendanceRecords.push(newRecord);
    saveToStorage();
    return id;
  }

  checkDuplicateScan(scanId: string): boolean {
    return storedAttendanceRecords.some(r => r.scanId === scanId);
  }

  // === Geofencing Methods ===

  getGeofences(): Geofence[] {
    return [...storedGeofences];
  }

  getGeofencesForRoute(routeId: string): Geofence[] {
    return storedGeofences.filter(g => g.routeId === routeId && g.active);
  }

  addGeofence(geofence: Omit<Geofence, 'id' | 'active'>): string {
    const id = `GF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newGeofence: Geofence = {
      ...geofence,
      id,
      active: true,
    };

    storedGeofences.push(newGeofence);
    saveToStorage();
    return id;
  }

  updateGeofence(id: string, updates: Partial<Geofence>): boolean {
    const index = storedGeofences.findIndex(g => g.id === id);
    if (index === -1) return false;

    storedGeofences[index] = { ...storedGeofences[index], ...updates };
    saveToStorage();
    return true;
  }

  // Check if position is inside geofence (Haversine formula approximation)
  checkGeofenceEntry(geofence: Geofence, position: { lat: number; lng: number }): boolean {
    const distance = this.calculateDistance(
      geofence.center.lat,
      geofence.center.lng,
      position.lat,
      position.lng
    );
    return distance <= geofence.radius;
  }

  checkGeofenceExit(geofence: Geofence, position: { lat: number; lng: number }): boolean {
    const distance = this.calculateDistance(
      geofence.center.lat,
      geofence.center.lng,
      position.lat,
      position.lng
    );
    return distance > geofence.radius;
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Return meters
  }

  // === Alert Methods ===

  getAllAlerts(): Alert[] {
    return [...storedAlerts].sort((a, b) => b.timestamp - a.timestamp);
  }

  getAlertsByBus(busId: string): Alert[] {
    return this.getAllAlerts().filter(a => a.busId === busId);
  }

  getUnreadAlerts(): Alert[] {
    return this.getAllAlerts().filter(a => !a.read);
  }

  markAlertAsRead(alertId: string): boolean {
    const index = storedAlerts.findIndex(a => a.id === alertId);
    if (index === -1) return false;

    storedAlerts[index] = { ...storedAlerts[index], read: true };
    saveToStorage();
    return true;
  }

  createAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'read'>): string {
    // Check for duplicate alert based on type, busId, and location
    const existingAlert = storedAlerts.find(a =>
      a.type === alert.type &&
      a.busId === alert.busId &&
      a.location?.lat === alert.location?.lat &&
      a.location?.lng === alert.location?.lng
    );

    if (existingAlert) {
      return existingAlert.id;
    }

    const id = `ALT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlert: Alert = {
      ...alert,
      id,
      timestamp: Date.now(),
      read: false,
    };

    storedAlerts.push(newAlert);
    saveToStorage();
    return id;
  }

  // === Route Deviation Methods ===

  getRouteDeviation(busId: string): RouteDeviation | null {
    return storedRouteDeviations[busId] || null;
  }

  checkRouteDeviation(busId: string, position: { lat: number; lng: number }, routeId: string): boolean {
    // Get route for bus
    const routeStops = this.getRouteStops(routeId);
    if (routeStops.length < 2) return false;

    // Find closest point on route
    let minDistance = Infinity;
    for (let i = 0; i < routeStops.length - 1; i++) {
      const distance = this.pointToLineDistance(
        position.lat,
        position.lng,
        routeStops[i].lat,
        routeStops[i].lng,
        routeStops[i + 1].lat,
        routeStops[i + 1].lng
      );
      minDistance = Math.min(minDistance, distance);
    }

    // Threshold: 100 meters deviation
    const threshold = 100;
    const isDeviated = minDistance > threshold;

    if (isDeviated && (!storedRouteDeviations[busId] || !storedRouteDeviations[busId].isDeviated)) {
      storedRouteDeviations[busId] = {
        busId,
        deviationDistance: Math.round(minDistance),
        isDeviated: true,
        lastReportedAt: Date.now(),
      };
      saveToStorage();
    }

    return isDeviated;
  }

  clearDeviation(busId: string): boolean {
    if (!storedRouteDeviations[busId]) return false;

    storedRouteDeviations[busId] = {
      ...storedRouteDeviations[busId],
      isDeviated: false,
      clearedAt: Date.now(),
    };
    saveToStorage();
    return true;
  }

  // Helper: Get route stops (mock implementation)
  getRouteStops(routeId: string) {
    const mockRouteStops: Record<string, { lat: number; lng: number }[]> = {
      'route-a': [
        { lat: 11.0168, lng: 76.9558 },
        { lat: 11.0198, lng: 76.9588 },
        { lat: 11.0228, lng: 76.9618 },
        { lat: 11.0258, lng: 76.9648 },
        { lat: 11.0288, lng: 76.9678 },
      ],
      'route-b': [
        { lat: 11.0068, lng: 76.9458 },
        { lat: 11.0098, lng: 76.9488 },
        { lat: 11.0128, lng: 76.9518 },
        { lat: 11.0288, lng: 76.9678 },
      ],
    };
    return mockRouteStops[routeId] || [];
  }

  // Helper: Point to line distance
  pointToLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // === Unauthorized Stop Methods ===

  getUnauthorizedStop(busId: string): UnauthorizedStop | null {
    return storedUnauthorizedStops[busId] || null;
  }

  checkUnauthorizedStop(busId: string, position: { lat: number; lng: number }, speed: number): boolean {
    const stopThresholdDuration = 30; // 30 seconds
    const stopSpeedThreshold = 5; // 5 km/h

    // If bus is stopped (slow speed)
    if (speed <= stopSpeedThreshold) {
      const existingStop = storedUnauthorizedStops[busId];

      if (!existingStop) {
        storedUnauthorizedStops[busId] = {
          busId,
          location: { ...position },
          stopDuration: 1,
          detectedAt: Date.now(),
        };
        saveToStorage();
      } else {
        storedUnauthorizedStops[busId] = {
          ...existingStop,
          stopDuration: existingStop.stopDuration + 1,
        };
        saveToStorage();

        // Trigger alert after threshold duration
        if (existingStop.stopDuration >= stopThresholdDuration && !existingStop.resolvedAt) {
          return true;
        }
      }
    } else {
      // Bus is moving, clear any existing unauthorized stop
      if (storedUnauthorizedStops[busId]) {
        delete storedUnauthorizedStops[busId];
        saveToStorage();
      }
    }

    return false;
  }

  clearUnauthorizedStop(busId: string): boolean {
    if (!storedUnauthorizedStops[busId]) return false;

    storedUnauthorizedStops[busId] = {
      ...storedUnauthorizedStops[busId],
      resolvedAt: Date.now(),
    };
    saveToStorage();
    return true;
  }

  // === Mock Data Helpers ===

  getMockGeofences(): Geofence[] {
    return [...geofences];
  }

  getMockAlerts(): Alert[] {
    return [...alerts];
  }

  // Cleanup
  cleanup(): void {
    driverStatus = {};
    driverAvailability = {};
    sessions = {};
    storedAttendanceRecords = [];
    storedGeofences = [];
    storedAlerts = [];
    storedRouteDeviations = {};
    storedUnauthorizedStops = {};
  }
}

// Export singleton instance - lazy initialization to avoid SSR issues
let driverStateServiceInstance: DriverStateService | null = null;

export const driverStateService = (() => {
  if (!driverStateServiceInstance) {
    driverStateServiceInstance = new DriverStateService();
  }
  return driverStateServiceInstance;
})();
