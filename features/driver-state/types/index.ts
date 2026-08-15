// Driver State Types

// === Driver Status Types ===
export type DriverStatus = 'driving' | 'idle' | 'break';

// === Driver Availability Types ===
export type DriverAvailability = 'available' | 'unavailable';

// === Driver Session State ===
export interface DriverSession {
  driverId: string;
  busId?: string;
  status: DriverStatus;
  availability: DriverAvailability;
  startTime?: number;
  endTime?: number;
  currentTripId?: string;
}

// === Attendance Record ===
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  busId: string;
  tripId?: string;
  stopId?: string;
  stopName?: string;
  timestamp: number;
  status: 'picked_up' | 'dropped_off' | 'present' | 'absent';
  scannedBy?: 'qr' | 'rfid' | 'manual';
  scanId?: string; // To prevent duplicates
}

// === Geofence Types ===
export interface Geofence {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // meters
  type: 'entry' | 'exit' | 'both';
  active: boolean;
  routeId?: string; // Optional route association
}

// === Alert Types ===
export type AlertType = 'geofence' | 'deviation' | 'unauthorized_stop';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  busId: string;
  timestamp: number;
  read: boolean;
  location?: { lat: number; lng: number };
  relatedData?: any;
}

// === Route Deviation Types ===
export interface RouteDeviation {
  busId: string;
  deviationDistance: number; // meters
  isDeviated: boolean;
  lastReportedAt: number;
  clearedAt?: number;
}

// === Unauthorized Stop Types ===
export interface UnauthorizedStop {
  busId: string;
  location: { lat: number; lng: number };
  stopDuration: number; // seconds
  detectedAt: number;
  resolvedAt?: number;
}

// === Driver State Service Interface ===
export interface IDriverStateService {
  // Driver Status
  getDriverStatus(driverId: string): DriverStatus;
  setDriverStatus(driverId: string, status: DriverStatus): boolean;
  
  // Driver Availability
  getDriverAvailability(driverId: string): DriverAvailability;
  setDriverAvailability(driverId: string, availability: DriverAvailability): boolean;
  
  // Session Management
  getCurrentSession(driverId: string): DriverSession | null;
  startSession(driverId: string, busId?: string): boolean;
  endSession(driverId: string): boolean;
  
  // Attendance
  getAllAttendanceRecords(): AttendanceRecord[];
  getAttendanceByBus(busId: string): AttendanceRecord[];
  getAttendanceByStudent(studentId: string): AttendanceRecord[];
  createAttendanceRecord(record: Omit<AttendanceRecord, 'id' | 'timestamp'>): string;
  checkDuplicateScan(scanId: string): boolean;
  
  // Geofencing
  getGeofences(): Geofence[];
  getGeofencesForRoute(routeId: string): Geofence[];
  addGeofence(geofence: Omit<Geofence, 'id' | 'active'>): string;
  updateGeofence(id: string, updates: Partial<Geofence>): boolean;
  checkGeofenceEntry(geofence: Geofence, position: { lat: number; lng: number }): boolean;
  checkGeofenceExit(geofence: Geofence, position: { lat: number; lng: number }): boolean;
  
  // Alerts
  getAllAlerts(): Alert[];
  getAlertsByBus(busId: string): Alert[];
  getUnreadAlerts(): Alert[];
  markAlertAsRead(alertId: string): boolean;
  createAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'read'>): string;
  
  // Route Deviation
  getRouteDeviation(busId: string): RouteDeviation | null;
  checkRouteDeviation(busId: string, position: { lat: number; lng: number }, routeId: string): boolean;
  clearDeviation(busId: string): boolean;
  
  // Unauthorized Stop
  getUnauthorizedStop(busId: string): UnauthorizedStop | null;
  checkUnauthorizedStop(busId: string, position: { lat: number; lng: number }, speed: number): boolean;
  clearUnauthorizedStop(busId: string): boolean;
  
  // Mock data
  getMockGeofences(): Geofence[];
  getMockAlerts(): Alert[];
}
