// Route Optimization Service
// Produces AI-ready route recommendations using existing GPS/ETA/route data

import {
  IRouteOptimizationService,
  RouteOptimizationContext,
  RouteOptimizationRecommendation,
  RouteEfficiencyScore,
  RouteStopContext,
} from '../types/index';
import { createAIProvider } from '../providers/createProvider';
import { mockRoutes } from '@/features/eta/mock/routes';
import { mockBuses } from '@/features/eta/mock/vehicles';
import { mockStudents } from '@/lib/mockData';
import { etaService } from '@/features/eta/services/ETAService';
import { driverStateService } from '@/features/driver-state/services/DriverStateService';

function countStudentsAtStop(stopName: string, busId: string): number {
  return mockStudents.filter(
    s => s.busId === busId && s.stop.toLowerCase().includes(stopName.split(' ')[0].toLowerCase())
  ).length;
}

class RouteOptimizationService implements IRouteOptimizationService {
  private provider = createAIProvider();

  buildContext(busId: string): RouteOptimizationContext | null {
    const bus = mockBuses.find(b => b.id === busId);
    if (!bus) return null;

    const route = mockRoutes[bus.routeId as keyof typeof mockRoutes];
    if (!route) return null;

    const etaState = etaService.getBusETA(busId);
    const deviation = driverStateService.getRouteDeviation(busId);

    const remainingStops: RouteStopContext[] = route.stops
      .map((stop, index) => {
        const etaStop = etaState?.routeInfo.stops.find(s => s.id === stop.id);
        const isCompleted = etaStop?.isCompleted ?? index < (etaState?.routeInfo.completedStops ?? 0);
        return {
          id: stop.id,
          name: stop.name,
          lat: stop.lat,
          lng: stop.lng,
          order: stop.order,
          dwellTime: stop.dwellTime ?? 30,
          isCompleted,
          studentCount: countStudentsAtStop(stop.name, busId),
        };
      })
      .filter(s => !s.isCompleted);

    return {
      routeId: route.id,
      routeName: route.name,
      busId,
      driverId: bus.driverId,
      totalDistance: route.totalDistance,
      estimatedDuration: route.estimatedDuration,
      stopCount: route.stops.length,
      progressPercentage: etaState?.routeInfo.progressPercentage ?? 0,
      remainingStops,
      currentSpeed: etaState?.speed ?? bus.currentSpeed,
      trafficLevel: etaState?.traffic.level ?? 'low',
      trafficMultiplier: etaState?.traffic.config.speedMultiplier ?? 1,
      delayMinutes: etaState?.delay.minutes ?? 0,
      delayReason: etaState?.delay.reason ?? 'none',
      occupancy: bus.occupancy,
      capacity: bus.capacity,
      isDeviated: deviation?.isDeviated ?? false,
      deviationDistance: deviation?.deviationDistance,
    };
  }

  async getRecommendationsForBus(busId: string): Promise<RouteOptimizationRecommendation | null> {
    const context = this.buildContext(busId);
    if (!context) return null;
    return this.provider.optimizeRoute(context);
  }

  async getAllRecommendations(): Promise<RouteOptimizationRecommendation[]> {
    const results: RouteOptimizationRecommendation[] = [];
    for (const bus of mockBuses) {
      const rec = await this.getRecommendationsForBus(bus.id);
      if (rec) results.push(rec);
    }
    return results.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  getRouteEfficiencyScores(): RouteEfficiencyScore[] {
    return mockBuses.map(bus => {
      const route = mockRoutes[bus.routeId as keyof typeof mockRoutes];
      const etaState = etaService.getBusETA(bus.id);
      const deviation = driverStateService.getRouteDeviation(bus.id);
      const unauthorized = driverStateService.getUnauthorizedStop(bus.id);

      let score = 95;
      const factors: string[] = [];

      if (etaState?.status === 'delayed' || etaState?.status === 'heavy-traffic') {
        score -= 8;
        factors.push('Active delay');
      }
      if (deviation?.isDeviated) {
        score -= 12;
        factors.push('Route deviation');
      }
      if (unauthorized && !unauthorized.resolvedAt) {
        score -= 6;
        factors.push('Unauthorized stop');
      }
      if (bus.occupancy / bus.capacity > 0.9) {
        score -= 3;
        factors.push('High occupancy');
      }
      if (etaState?.traffic.config.speedMultiplier && etaState.traffic.config.speedMultiplier > 1.2) {
        score -= 4;
        factors.push('Traffic congestion');
      }

      score = Math.max(60, Math.min(100, score));

      return {
        routeId: route?.id ?? bus.routeId,
        routeName: route?.name ?? bus.routeName,
        busId: bus.id,
        score,
        trips: 48,
        delays: etaState?.delay.active ? 1 : Math.round((100 - score) / 4),
        factors,
      };
    });
  }
}

export const routeOptimizationService = new RouteOptimizationService();
