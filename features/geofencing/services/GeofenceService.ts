// Geofence Service - Geofencing alert system for bus tracking
// Detects when buses enter or exit monitored geographic zones

import { IGeofenceService, Geofence, GeofenceAlert, GeofenceAlertType } from '../types/index';
import { mockGeofences, mockGeofenceAlerts, calculateDistance, isInsideGeofence } from '../mock/data';

// Storage keys
const STORAGE_KEYS = {
  GEOFENCES: 'campbus_geofences',
  GEOFENCE_ALERTS: 'campbus_geofence_alerts',
};

// In-memory storage
let geofences: Geofence[] = [];
let geofenceAlerts: GeofenceAlert[] = [];

// Browser environment check
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Load from localStorage on init - browser only
function loadFromStorage() {
  if (!isBrowser) return;

  try {
    const storedGeofences = localStorage.getItem(STORAGE_KEYS.GEOFENCES);
    const storedAlerts = localStorage.getItem(STORAGE_KEYS.GEOFENCE_ALERTS);

    if (storedGeofences) geofences = JSON.parse(storedGeofences);
    if (storedAlerts) geofenceAlerts = JSON.parse(storedAlerts);
  } catch (e) {
    // Silent fail for SSR - use initial data
  }

  // Initialize with mock data if empty
  if (geofences.length === 0) {
    geofences = [...mockGeofences];
  }
  if (geofenceAlerts.length === 0) {
    geofenceAlerts = [...mockGeofenceAlerts];
  }
}

function saveToStorage() {
  if (!isBrowser) return;

  try {
    localStorage.setItem(STORAGE_KEYS.GEOFENCES, JSON.stringify(geofences));
    localStorage.setItem(STORAGE_KEYS.GEOFENCE_ALERTS, JSON.stringify(geofenceAlerts));
  } catch (e) {
    // Silent fail for SSR
  }
}

class GeofenceService implements IGeofenceService {
  constructor() {
    loadFromStorage();
  }

  // === Geofence Methods ===

  getGeofences(): Geofence[] {
    return [...geofences];
  }

  getGeofencesForRoute(routeId: string): Geofence[] {
    return geofences.filter(g => g.routeId === routeId && g.active);
  }

  addGeofence(geofence: Omit<Geofence, 'id' | 'active'>): string {
    const id = `GF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newGeofence: Geofence = {
      ...geofence,
      id,
      active: true,
    };

    geofences.push(newGeofence);
    saveToStorage();
    return id;
  }

  updateGeofence(id: string, updates: Partial<Geofence>): boolean {
    const index = geofences.findIndex(g => g.id === id);
    if (index === -1) return false;

    geofences[index] = { ...geofences[index], ...updates };
    saveToStorage();
    return true;
  }

  // Check if position is inside geofence
  isInsideGeofence(geofence: Geofence, position: { lat: number; lng: number }): boolean {
    return isInsideGeofence(geofence, position);
  }

  // Check for geofence transition (entry/exit)
  checkGeofenceTransition(
    geofence: Geofence,
    position: { lat: number; lng: number },
    lastState: boolean
  ): { inside: boolean; transitioned: boolean } {
    const currentInside = this.isInsideGeofence(geofence, position);
    const transitioned = currentInside !== lastState;
    
    return {
      inside: currentInside,
      transitioned,
    };
  }

  // === Alert Methods ===

  getGeofenceAlerts(): GeofenceAlert[] {
    return [...geofenceAlerts].sort((a, b) => b.timestamp - a.timestamp);
  }

  getUnreadGeofenceAlerts(): GeofenceAlert[] {
    return this.getGeofenceAlerts().filter(a => !a.read);
  }

  createGeofenceAlert(alert: Omit<GeofenceAlert, 'id' | 'timestamp' | 'read'>): string {
    // Check for duplicate alert based on geofenceId, busId, and alertType
    const existingAlert = geofenceAlerts.find(a =>
      a.geofenceId === alert.geofenceId &&
      a.busId === alert.busId &&
      a.alertType === alert.alertType
    );

    if (existingAlert) {
      return existingAlert.id;
    }

    const id = `GFA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newAlert: GeofenceAlert = {
      ...alert,
      id,
      timestamp: Date.now(),
      read: false,
    };

    geofenceAlerts.push(newAlert);
    saveToStorage();
    return id;
  }

  markAlertAsRead(alertId: string): boolean {
    const index = geofenceAlerts.findIndex(a => a.id === alertId);
    if (index === -1) return false;

    geofenceAlerts[index] = { ...geofenceAlerts[index], read: true };
    saveToStorage();
    return true;
  }

  // === Mock Data Helpers ===

  getMockGeofences(): Geofence[] {
    return [...mockGeofences];
  }

  getMockGeofenceAlerts(): GeofenceAlert[] {
    return [...mockGeofenceAlerts];
  }

  // Cleanup
  cleanup(): void {
    geofences = [];
    geofenceAlerts = [];
  }
}

// Export singleton instance - lazy initialization to avoid SSR issues
let geofenceServiceInstance: GeofenceService | null = null;

export const geofenceService = (() => {
  if (!geofenceServiceInstance) {
    geofenceServiceInstance = new GeofenceService();
  }
  return geofenceServiceInstance;
})();
