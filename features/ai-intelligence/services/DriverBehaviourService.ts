// Driver Behaviour Analysis Service
// Computes explainable driver safety metrics from existing project data

import {
  IDriverBehaviourService,
  DriverBehaviourContext,
  DriverBehaviourResult,
} from '../types/index';
import { createAIProvider } from '../providers/createProvider';
import { mockBuses } from '@/features/eta/mock/vehicles';
import { mockDrivers } from '@/lib/mockData';
import { driverStateService } from '@/features/driver-state/services/DriverStateService';
import { geofenceService } from '@/features/geofencing/services/GeofenceService';

class DriverBehaviourService implements IDriverBehaviourService {
  private provider = createAIProvider();

  buildContext(driverId: string): DriverBehaviourContext | null {
    const driver = mockDrivers.find(d => d.id === driverId);
    if (!driver) return null;

    const bus = mockBuses.find(b => b.driverId === driverId || b.id === driver.busId);
    if (!bus) return null;

    const session = driverStateService.getCurrentSession(driverId);
    const status = driverStateService.getDriverStatus(driverId);
    const deviation = driverStateService.getRouteDeviation(bus.id);
    const unauthorizedStop = driverStateService.getUnauthorizedStop(bus.id);

    const alerts = driverStateService.getAllAlerts().filter(a => a.busId === bus.id);
    const geofenceAlerts = geofenceService.getGeofenceAlerts().filter(a => a.busId === bus.id);

    const sessionStart = session?.startTime ?? Date.now() - 3600000;
    const drivingTimeMinutes = status === 'driving'
      ? Math.round((Date.now() - (session?.startTime ?? sessionStart)) / 60000)
      : 0;
    const idleTimeMinutes = status === 'idle' || status === 'break'
      ? Math.round((Date.now() - sessionStart) / 60000)
      : bus.currentSpeed === 0 ? 5 : 0;

    return {
      driverId,
      driverName: driver.name,
      busId: bus.id,
      currentSpeed: bus.currentSpeed,
      averageSpeed: bus.averageSpeed,
      totalTrips: driver.trips,
      drivingTimeMinutes,
      idleTimeMinutes,
      deviation: deviation
        ? { isDeviated: deviation.isDeviated, distance: deviation.deviationDistance }
        : undefined,
      unauthorizedStop: unauthorizedStop
        ? { duration: unauthorizedStop.stopDuration, resolved: !!unauthorizedStop.resolvedAt }
        : undefined,
      alertCount: alerts.length,
      geofenceAlertCount: geofenceAlerts.length,
    };
  }

  async analyzeDriver(driverId: string): Promise<DriverBehaviourResult | null> {
    const context = this.buildContext(driverId);
    if (!context) return null;
    return this.provider.analyzeDriverBehaviour(context);
  }

  async analyzeAllDrivers(): Promise<DriverBehaviourResult[]> {
    const results: DriverBehaviourResult[] = [];
    for (const driver of mockDrivers) {
      const result = await this.analyzeDriver(driver.id);
      if (result) results.push(result);
    }
    return results.sort((a, b) => b.metrics.safetyScore - a.metrics.safetyScore);
  }

  getFleetAverageSafetyScore(): number {
    const scores = mockDrivers.map(d => {
      const bus = mockBuses.find(b => b.driverId === d.id);
      if (!bus) return d.safetyScore;
      const deviation = driverStateService.getRouteDeviation(bus.id);
      let score = d.safetyScore;
      if (deviation?.isDeviated) score -= 8;
      const unauthorized = driverStateService.getUnauthorizedStop(bus.id);
      if (unauthorized && !unauthorized.resolvedAt) score -= 5;
      if (bus.currentSpeed > 50) score -= 3;
      return Math.max(60, score);
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }
}

export const driverBehaviourService = new DriverBehaviourService();
