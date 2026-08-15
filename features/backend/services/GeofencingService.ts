// Geofencing Service - Business logic for geofencing operations

import { geofenceService } from '../../geofencing/services/GeofenceService';
import { AlertRepository } from '../repositories/AlertRepository';
import { Geofence } from '../../geofencing/types';
import { Alert } from '../types';

export class GeofencingService {
  private frontendService = geofenceService;
  private alertRepository = new AlertRepository();

  async getGeofences(): Promise<Geofence[]> {
    return this.frontendService.getGeofences();
  }

  async getGeofencesForRoute(routeId: string): Promise<Geofence[]> {
    return this.frontendService.getGeofencesForRoute(routeId);
  }

  async checkGeofenceTransition(
    geofence: Geofence,
    position: { lat: number; lng: number },
    lastState: boolean
  ): Promise<{ inside: boolean; transitioned: boolean }> {
    return this.frontendService.checkGeofenceTransition(geofence, position, lastState);
  }

  async createAlert(
    busId: string,
    type: 'geofence' | 'deviation' | 'unauthorized_stop',
    title: string,
    message: string,
    severity?: 'info' | 'warning' | 'critical',
    location?: { lat: number; lng: number }
  ): Promise<string> {
    const alertData: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: busId,
      busId,
      type,
      title,
      message,
      resolved: false,
    };
    if (severity) alertData.severity = severity;
    if (location) alertData.location = location;
    const alert = await this.alertRepository.create(alertData);
    return alert.id;
  }

  async getUnresolvedAlerts(busId: string): Promise<Alert[]> {
    return this.alertRepository.getUnresolvedForBus(busId);
  }

  async resolveAlert(alertId: string): Promise<boolean> {
    return this.alertRepository.resolve(alertId);
  }
}
