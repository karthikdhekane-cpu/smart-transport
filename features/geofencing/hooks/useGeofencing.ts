// useGeofencing Hook - Custom React hook for geofencing alerts
// Provides geofence monitoring and alert management

import { useState, useEffect, useCallback } from 'react';
import { geofenceService } from '../services/GeofenceService';
import { Geofence, GeofenceAlert } from '../types/index';

export interface UseGeofencingReturn {
  // Geofences
  geofences: Geofence[];
  geofencesForRoute: (routeId: string) => Geofence[];
  addGeofence: (geofence: Omit<Geofence, 'id' | 'active'>) => string;
  
  // Alerts
  alerts: GeofenceAlert[];
  unreadAlerts: GeofenceAlert[];
  markAlertAsRead: (alertId: string) => boolean;
  
  // Monitoring
  checkGeofenceTransition: (geofence: Geofence, position: { lat: number; lng: number }, lastState: boolean) => { inside: boolean; transitioned: boolean };
  
  // Loading state
  isLoading: boolean;
}

export function useGeofencing(): UseGeofencingReturn {
  const [geofences, setGeofences] = useState<Geofence[]>(() => geofenceService.getGeofences());
  const [alerts, setAlerts] = useState<GeofenceAlert[]>(() => geofenceService.getGeofenceAlerts());
  const [unreadAlerts, setUnreadAlerts] = useState<GeofenceAlert[]>(() => geofenceService.getUnreadGeofenceAlerts());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setGeofences(geofenceService.getGeofences());
    setAlerts(geofenceService.getGeofenceAlerts());
    setUnreadAlerts(geofenceService.getUnreadGeofenceAlerts());
    setIsLoading(false);
  }, []);

  const geofencesForRoute = useCallback((routeId: string) => {
    return geofenceService.getGeofencesForRoute(routeId);
  }, []);

  const addGeofenceHandler = useCallback((geofence: Omit<Geofence, 'id' | 'active'>) => {
    const id = geofenceService.addGeofence(geofence);
    setGeofences(geofenceService.getGeofences());
    return id;
  }, []);

  const markAlertAsReadHandler = useCallback((alertId: string) => {
    const success = geofenceService.markAlertAsRead(alertId);
    if (success) {
      setAlerts(geofenceService.getGeofenceAlerts());
      setUnreadAlerts(geofenceService.getUnreadGeofenceAlerts());
    }
    return success;
  }, []);

  const checkGeofenceTransitionHandler = useCallback((geofence: Geofence, position: { lat: number; lng: number }, lastState: boolean) => {
    return geofenceService.checkGeofenceTransition(geofence, position, lastState);
  }, []);

  return {
    geofences,
    geofencesForRoute,
    addGeofence: addGeofenceHandler,
    alerts,
    unreadAlerts,
    markAlertAsRead: markAlertAsReadHandler,
    checkGeofenceTransition: checkGeofenceTransitionHandler,
    isLoading,
  };
}
