// Mock Data for Driver State Management

import { DriverStatus, DriverAvailability, DriverSession, AttendanceRecord, Geofence, Alert, RouteDeviation, UnauthorizedStop } from '../types/index';

// Mock driver sessions
export const driverSessions: Record<string, DriverSession> = {
  'D001': {
    driverId: 'D001',
    busId: 'BUS-01',
    status: 'driving',
    availability: 'available',
    startTime: Date.now() - 3600000, // Started 1 hour ago
    currentTripId: 'TRIP-001',
  },
  'D002': {
    driverId: 'D002',
    busId: 'BUS-02',
    status: 'idle',
    availability: 'available',
    startTime: Date.now() - 7200000, // Started 2 hours ago
    currentTripId: 'TRIP-002',
  },
  'D003': {
    driverId: 'D003',
    busId: 'BUS-03',
    status: 'break',
    availability: 'unavailable',
    startTime: Date.now() - 14400000, // Started 4 hours ago
    endTime: Date.now() - 7200000, // Ended 2 hours ago
  },
  'D004': {
    driverId: 'D004',
    busId: 'BUS-04',
    status: 'driving',
    availability: 'available',
    startTime: Date.now() - 5400000, // Started 1.5 hours ago
    currentTripId: 'TRIP-004',
  },
};

// Mock attendance records
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT-001',
    studentId: 'S001',
    studentName: 'Priya Sharma',
    busId: 'BUS-01',
    tripId: 'TRIP-001',
    stopId: 'stop-a1',
    stopName: 'Gandhipuram Bus Stand',
    timestamp: Date.now() - 7200000, // 2 hours ago
    status: 'picked_up',
    scannedBy: 'rfid',
    scanId: 'RFID-S001-001',
  },
  {
    id: 'ATT-002',
    studentId: 'S002',
    studentName: 'Arjun Nair',
    busId: 'BUS-01',
    tripId: 'TRIP-001',
    stopId: 'stop-a2',
    stopName: 'Town Hall',
    timestamp: Date.now() - 7000000,
    status: 'picked_up',
    scannedBy: 'rfid',
    scanId: 'RFID-S002-001',
  },
  {
    id: 'ATT-003',
    studentId: 'S001',
    studentName: 'Priya Sharma',
    busId: 'BUS-01',
    tripId: 'TRIP-001',
    stopId: 'stop-a5',
    stopName: 'College Main Gate',
    timestamp: Date.now() - 3600000, // 1 hour ago
    status: 'dropped_off',
    scannedBy: 'qr',
    scanId: 'QR-S001-001',
  },
  {
    id: 'ATT-004',
    studentId: 'S003',
    studentName: 'Kavya Reddy',
    busId: 'BUS-02',
    tripId: 'TRIP-002',
    stopId: 'stop-b1',
    stopName: 'RS Puram',
    timestamp: Date.now() - 5400000,
    status: 'picked_up',
    scannedBy: 'manual',
    scanId: 'MANUAL-S003-001',
  },
];

// Mock geofences (college campus zones)
export const geofences: Geofence[] = [
  {
    id: 'GF-001',
    name: 'Main Campus Zone',
    center: { lat: 11.0168, lng: 76.9558 },
    radius: 500,
    type: 'both',
    active: true,
    routeId: 'route-a',
  },
  {
    id: 'GF-002',
    name: 'Engineering Block Zone',
    center: { lat: 11.0200, lng: 76.9600 },
    radius: 300,
    type: 'entry',
    active: true,
    routeId: 'route-a',
  },
  {
    id: 'GF-003',
    name: 'Sports Complex Zone',
    center: { lat: 11.0140, lng: 76.9520 },
    radius: 400,
    type: 'exit',
    active: true,
    routeId: 'route-b',
  },
  {
    id: 'GF-004',
    name: 'Hostel Zone',
    center: { lat: 11.0220, lng: 76.9650 },
    radius: 350,
    type: 'both',
    active: true,
    routeId: 'route-c',
  },
];

// Mock alerts
export const alerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'geofence',
    severity: 'warning',
    title: 'Bus Entered Restricted Zone',
    message: 'BUS-01 entered Main Campus Zone',
    busId: 'BUS-01',
    timestamp: Date.now() - 3600000,
    read: false,
    location: { lat: 11.0168, lng: 76.9558 },
  },
  {
    id: 'ALT-002',
    type: 'deviation',
    severity: 'warning',
    title: 'Route Deviation Detected',
    message: 'BUS-03 deviated from Route C near Peelamedu',
    busId: 'BUS-03',
    timestamp: Date.now() - 1800000,
    read: false,
    location: { lat: 11.0098, lng: 76.9458 },
  },
  {
    id: 'ALT-003',
    type: 'unauthorized_stop',
    severity: 'critical',
    title: 'Unauthorized Stop Detected',
    message: 'BUS-02 made unauthorized stop near RS Puram',
    busId: 'BUS-02',
    timestamp: Date.now() - 900000,
    read: false,
    location: { lat: 11.0120, lng: 76.9500 },
  },
];

// Mock route deviations
export const routeDeviations: Record<string, RouteDeviation> = {
  'BUS-03': {
    busId: 'BUS-03',
    deviationDistance: 250,
    isDeviated: true,
    lastReportedAt: Date.now() - 1800000,
  },
};

// Mock unauthorized stops
export const unauthorizedStops: Record<string, UnauthorizedStop> = {
  'BUS-02': {
    busId: 'BUS-02',
    location: { lat: 11.0120, lng: 76.9500 },
    stopDuration: 45,
    detectedAt: Date.now() - 900000,
  },
};
