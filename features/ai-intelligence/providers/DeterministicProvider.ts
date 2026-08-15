// Deterministic Intelligence Provider
// Rule-based recommendations using existing project data.
// Used when no external AI/ML provider is configured.

import {
  IAIIntelligenceProvider,
  RouteOptimizationContext,
  RouteOptimizationRecommendation,
  DriverBehaviourContext,
  DriverBehaviourResult,
  BehaviourRating,
  RecommendationPriority,
} from '../types/index';
import { calculateDistance } from '@/features/eta/utils/math';

const SPEED_LIMIT_KMH = 50;

function formatTimeImprovement(seconds: number): string {
  if (seconds <= 0) return 'No improvement';
  if (seconds < 60) return `${seconds}s faster`;
  return `${Math.round(seconds / 60)} min faster`;
}

function nearestNeighborOrder(
  startLat: number,
  startLng: number,
  stops: RouteOptimizationContext['remainingStops']
): string[] {
  const remaining = [...stops];
  const ordered: string[] = [];
  let lat = startLat;
  let lng = startLng;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((stop, i) => {
      const d = calculateDistance(lat, lng, stop.lat, stop.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    });
    const next = remaining.splice(nearestIdx, 1)[0];
    ordered.push(next.id);
    lat = next.lat;
    lng = next.lng;
  }

  return ordered;
}

function estimateRouteTime(
  stops: RouteOptimizationContext['remainingStops'],
  order: string[],
  avgSpeedKmh: number,
  trafficMultiplier: number
): number {
  if (order.length === 0) return 0;

  const stopMap = new Map(stops.map(s => [s.id, s]));
  let totalSeconds = 0;
  let prevLat = stops[0]?.lat ?? 0;
  let prevLng = stops[0]?.lng ?? 0;

  for (const id of order) {
    const stop = stopMap.get(id);
    if (!stop) continue;
    const distM = calculateDistance(prevLat, prevLng, stop.lat, stop.lng);
    const speedMs = (avgSpeedKmh * 1000) / 3600;
    totalSeconds += distM / Math.max(speedMs, 1);
    totalSeconds += (stop.dwellTime ?? 30) * trafficMultiplier;
    prevLat = stop.lat;
    prevLng = stop.lng;
  }

  return Math.round(totalSeconds);
}

function ratingFromScore(score: number): BehaviourRating {
  if (score >= 90) return 'excellent';
  if (score >= 80) return 'good';
  if (score >= 70) return 'fair';
  if (score >= 60) return 'needs_improvement';
  return 'critical';
}

export class DeterministicIntelligenceProvider implements IAIIntelligenceProvider {
  readonly name = 'deterministic' as const;

  async optimizeRoute(context: RouteOptimizationContext): Promise<RouteOptimizationRecommendation> {
    const reasons: string[] = [];
    let priority: RecommendationPriority = 'low';
    let confidence = 0.65;
    let recommendedStopOrder = context.remainingStops.map(s => s.id);
    let affectedStops: string[] = [];
    let improvementSeconds = 0;

    const occupancyRatio = context.capacity > 0 ? context.occupancy / context.capacity : 0;
    const avgSpeed = Math.max(context.currentSpeed, 25);

    // Deviation: highest priority — return to planned route
    if (context.isDeviated) {
      reasons.push(
        `Bus deviated ${context.deviationDistance ?? 0}m from planned route — return to scheduled path immediately`
      );
      priority = 'critical';
      confidence = 0.92;
      affectedStops = context.remainingStops.map(s => s.name);
      return this.buildRecommendation(context, context.routeName, recommendedStopOrder, reasons, 0, priority, confidence, affectedStops);
    }

    // Traffic + delay: try stop reorder optimization
    if (context.remainingStops.length >= 2) {
      const currentOrder = context.remainingStops.map(s => s.id);
      const firstStop = context.remainingStops[0];
      const optimizedOrder = nearestNeighborOrder(firstStop.lat, firstStop.lng, context.remainingStops);

      const currentTime = estimateRouteTime(context.remainingStops, currentOrder, avgSpeed, context.trafficMultiplier);
      const optimizedTime = estimateRouteTime(context.remainingStops, optimizedOrder, avgSpeed, context.trafficMultiplier);
      improvementSeconds = Math.max(0, currentTime - optimizedTime);

      if (improvementSeconds >= 60 && JSON.stringify(currentOrder) !== JSON.stringify(optimizedOrder)) {
        recommendedStopOrder = optimizedOrder;
        affectedStops = optimizedOrder.map(id => {
          const stop = context.remainingStops.find(s => s.id === id);
          return stop?.name ?? id;
        });
        reasons.push(
          `Nearest-neighbor reorder of ${context.remainingStops.length} remaining stops saves ~${Math.round(improvementSeconds / 60)} min`
        );
        priority = 'medium';
        confidence = 0.78;
      }
    }

    if (context.delayMinutes >= 5) {
      reasons.push(`Active delay of ${context.delayMinutes} min (${context.delayReason}) — optimize remaining segment`);
      priority = priority === 'low' ? 'high' : priority;
      confidence = Math.min(confidence + 0.1, 0.95);
    }

    if (context.trafficMultiplier >= 1.3) {
      reasons.push(`Heavy traffic (${context.trafficLevel}) increases segment travel time by ${Math.round((context.trafficMultiplier - 1) * 100)}%`);
      if (priority === 'low') priority = 'medium';
    }

    // High occupancy: suggest express pattern
    if (occupancyRatio >= 0.85 && context.remainingStops.length > 2) {
      const lowDemandStops = context.remainingStops.filter(s => (s.studentCount ?? 0) <= 2);
      if (lowDemandStops.length > 0) {
        reasons.push(
          `Bus at ${Math.round(occupancyRatio * 100)}% capacity — consider express run skipping ${lowDemandStops.length} low-demand stop(s)`
        );
        affectedStops = Array.from(new Set([...affectedStops, ...lowDemandStops.map(s => s.name)]));
        improvementSeconds = Math.max(improvementSeconds, lowDemandStops.length * 120);
        priority = 'high';
        confidence = Math.min(confidence + 0.05, 0.9);
      }
    }

    if (reasons.length === 0) {
      reasons.push('Current route sequence is optimal based on distance, stops, and traffic conditions');
      confidence = 0.85;
    }

    const routeLabel =
      recommendedStopOrder !== context.remainingStops.map(s => s.id)
        ? `${context.routeName} (Optimized Order)`
        : context.routeName;

    return this.buildRecommendation(
      context,
      routeLabel,
      recommendedStopOrder,
      reasons,
      improvementSeconds,
      priority,
      confidence,
      affectedStops
    );
  }

  private buildRecommendation(
    context: RouteOptimizationContext,
    routeName: string,
    stopOrder: string[],
    reasons: string[],
    improvementSeconds: number,
    priority: RecommendationPriority,
    confidence: number,
    affectedStops: string[]
  ): RouteOptimizationRecommendation {
    return {
      id: `opt-${context.busId}-${Date.now()}`,
      routeId: context.routeId,
      busId: context.busId,
      recommendedRouteName: routeName,
      recommendedStopOrder: stopOrder,
      reason: reasons[0] ?? 'Route analyzed',
      reasons,
      estimatedTimeImprovementSeconds: improvementSeconds,
      estimatedTimeImprovementText: formatTimeImprovement(improvementSeconds),
      affectedStops,
      confidence,
      priority,
      provider: 'deterministic',
      generatedAt: Date.now(),
    };
  }

  async analyzeDriverBehaviour(context: DriverBehaviourContext): Promise<DriverBehaviourResult> {
    const events: DriverBehaviourResult['events'] = [];
    const reasons: string[] = [];
    const recommendations: string[] = [];

    // Speed compliance from recorded average speed
    const overspeedDelta = Math.max(0, context.currentSpeed - SPEED_LIMIT_KMH);
    const speedCompliance = Math.max(
      0,
      Math.min(100, 100 - overspeedDelta * 3 - Math.max(0, context.averageSpeed - SPEED_LIMIT_KMH) * 1.5)
    );

    if (context.currentSpeed > SPEED_LIMIT_KMH) {
      events.push({
        type: 'overspeed',
        label: 'Over-Speeding',
        count: 1,
        severity: context.currentSpeed > 60 ? 'critical' : 'warning',
        source: 'live',
        description: `Current speed ${Math.round(context.currentSpeed)} km/h exceeds ${SPEED_LIMIT_KMH} km/h limit`,
      });
      reasons.push(`Speed ${Math.round(context.currentSpeed)} km/h exceeds campus limit of ${SPEED_LIMIT_KMH} km/h`);
      recommendations.push('Reduce speed to stay within the campus safety limit');
    } else {
      reasons.push(`Speed compliance good at ${Math.round(context.currentSpeed)} km/h (limit ${SPEED_LIMIT_KMH} km/h)`);
    }

    // Route compliance from deviation data
    let routeCompliance = 100;
    if (context.deviation?.isDeviated) {
      const penalty = Math.min(40, Math.round((context.deviation.distance / 100) * 8));
      routeCompliance = Math.max(0, 100 - penalty);
      events.push({
        type: 'route_deviation',
        label: 'Route Deviation',
        count: 1,
        severity: 'warning',
        source: 'recorded',
        description: `Deviated ${context.deviation.distance}m from planned route`,
      });
      reasons.push(`Route deviation of ${context.deviation.distance}m detected`);
      recommendations.push('Return to assigned route and acknowledge deviation alert');
    } else {
      reasons.push('No active route deviations');
    }

    // Stop compliance from unauthorized stops
    let stopCompliance = 100;
    if (context.unauthorizedStop && !context.unauthorizedStop.resolved) {
      stopCompliance = Math.max(0, 100 - Math.min(35, context.unauthorizedStop.duration));
      events.push({
        type: 'unauthorized_stop',
        label: 'Unauthorized Stop',
        count: 1,
        severity: 'critical',
        source: 'recorded',
        description: `Unauthorized stop for ${context.unauthorizedStop.duration}s`,
      });
      reasons.push(`Unauthorized stop lasting ${context.unauthorizedStop.duration}s`);
      recommendations.push('Only stop at designated bus stops unless emergency');
    } else {
      reasons.push('No unauthorized stops detected');
    }

    // Idle time from session data
    if (context.idleTimeMinutes > 15) {
      events.push({
        type: 'idle',
        label: 'Extended Idle',
        count: 1,
        severity: 'info',
        source: 'recorded',
        description: `${context.idleTimeMinutes} min idle time recorded`,
      });
    }

    // Alerts
    const totalAlerts = context.alertCount + context.geofenceAlertCount;
    if (context.geofenceAlertCount > 0) {
      events.push({
        type: 'geofence_violation',
        label: 'Geofence Alerts',
        count: context.geofenceAlertCount,
        severity: 'warning',
        source: 'recorded',
      });
    }
    if (context.alertCount > 0) {
      events.push({
        type: 'alert',
        label: 'Safety Alerts',
        count: context.alertCount,
        severity: 'warning',
        source: 'recorded',
      });
    }

    const alertFrequency = Math.max(0, 100 - totalAlerts * 8);
    if (totalAlerts > 0) {
      reasons.push(`${totalAlerts} safety/geofence alert(s) on record`);
    }

    const safetyScore = Math.round(
      speedCompliance * 0.3 +
        routeCompliance * 0.3 +
        stopCompliance * 0.25 +
        alertFrequency * 0.15
    );

    const overallRating = ratingFromScore(safetyScore);

    if (recommendations.length === 0) {
      recommendations.push('Maintain current driving standards');
    }

    return {
      driverId: context.driverId,
      driverName: context.driverName,
      busId: context.busId,
      metrics: {
        safetyScore,
        speedCompliance: Math.round(speedCompliance),
        routeCompliance: Math.round(routeCompliance),
        stopCompliance: Math.round(stopCompliance),
        alertFrequency: Math.round(alertFrequency),
        overallRating,
      },
      events,
      reasons,
      recommendations,
      provider: 'deterministic',
      analyzedAt: Date.now(),
      dataSources: {
        speed: 'live',
        deviations: 'recorded',
        braking: 'unavailable',
        turns: 'unavailable',
      },
    };
  }
}

export const deterministicProvider = new DeterministicIntelligenceProvider();
