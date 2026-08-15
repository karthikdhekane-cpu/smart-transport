// Mock Geofencing Data

import { Geofence, GeofenceAlert } from '../types/index';

export const mockGeofences: Geofence[] = [
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
  {
    id: 'GF-005',
    name: 'College Boundary',
    center: { lat: 11.0180, lng: 76.9580 },
    radius: 800,
    type: 'both',
    active: true,
    routeId: 'route-a',
  },
];

export const mockGeofenceAlerts: GeofenceAlert[] = [
  {
    id: 'GFA-001',
    geofenceId: 'GF-001',
    geofenceName: 'Main Campus Zone',
    alertType: 'geofence_entry',
    busId: 'BUS-01',
    location: { lat: 11.0168, lng: 76.9558 },
    timestamp: Date.now() - 3600000, // 1 hour ago
    read: false,
  },
  {
    id: 'GFA-002',
    geofenceId: 'GF-004',
    geofenceName: 'Hostel Zone',
    alertType: 'geofence_entry',
    busId: 'BUS-03',
    location: { lat: 11.0220, lng: 76.9650 },
    timestamp: Date.now() - 7200000, // 2 hours ago
    read: true,
  },
  {
    id: 'GFA-003',
    geofenceId: 'GF-003',
    geofenceName: 'Sports Complex Zone',
    alertType: 'geofence_exit',
    busId: 'BUS-02',
    location: { lat: 11.0140, lng: 76.9520 },
    timestamp: Date.now() - 14400000, // 4 hours ago
    read: true,
  },
];

// Helper to calculate distance
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Return meters
};

// Helper to check if point is inside geofence
export const isInsideGeofence = (geofence: Geofence, position: { lat: number; lng: number }): boolean => {
  const distance = calculateDistance(
    geofence.center.lat,
    geofence.center.lng,
    position.lat,
    position.lng
  );
  return distance <= geofence.radius;
};
