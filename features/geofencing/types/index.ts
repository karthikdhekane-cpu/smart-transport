// Geofencing Types

// === Geofence Type ===
export type GeofenceType = 'entry' | 'exit' | 'both';

// === Geofence Alert Type ===
export type GeofenceAlertType = 'geofence_entry' | 'geofence_exit';

// === Geofence ===
export interface Geofence {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // meters
  type: GeofenceType;
  active: boolean;
  routeId?: string;
}

// === Geofence Alert ===
export interface GeofenceAlert {
  id: string;
  geofenceId: string;
  geofenceName: string;
  alertType: GeofenceAlertType;
  busId: string;
  location: { lat: number; lng: number };
  timestamp: number;
  read: boolean;
}

// === Geofence Service Interface ===
export interface IGeofenceService {
  // Geofences
  getGeofences(): Geofence[];
  getGeofencesForRoute(routeId: string): Geofence[];
  addGeofence(geofence: Omit<Geofence, 'id' | 'active'>): string;
  updateGeofence(id: string, updates: Partial<Geofence>): boolean;
  
  // Check functions
  isInsideGeofence(geofence: Geofence, position: { lat: number; lng: number }): boolean;
  checkGeofenceTransition(
    geofence: Geofence,
    position: { lat: number; lng: number },
    lastState: boolean
  ): { inside: boolean; transitioned: boolean };
  
  // Alert management
  getGeofenceAlerts(): GeofenceAlert[];
  getUnreadGeofenceAlerts(): GeofenceAlert[];
  createGeofenceAlert(alert: Omit<GeofenceAlert, 'id' | 'timestamp' | 'read'>): string;
  markAlertAsRead(alertId: string): boolean;
  
  // Mock data
  getMockGeofences(): Geofence[];
  getMockGeofenceAlerts(): GeofenceAlert[];
}
