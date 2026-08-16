// Speed Monitoring Service
// Handles speed tracking, overspeed detection, and speed history

import { SpeedEvent, SpeedHistory, SpeedMonitoringData } from '../types/index';
import { mockBuses } from '@/lib/mockData';

const SPEED_LIMIT_KMH = 50; // Default speed limit for campus buses
const WARNING_THRESHOLD = 45; // Warning threshold
const OVERSPEED_THRESHOLD = 60; // Critical overspeed threshold

class SpeedMonitoringService {
  private speedEvents: Map<string, SpeedEvent[]> = new Map();
  private speedHistory: Map<string, SpeedHistory> = new Map();

  constructor() {
    this.initializeSpeedHistory();
  }

  private initializeSpeedHistory() {
    // Initialize speed history for each bus
    mockBuses.forEach(bus => {
      // Use driver name as identifier since mock data uses driver string
      const driverId = `D${bus.id.split('-')[1]}`; // Generate driver ID from bus ID
      const history: SpeedHistory = {
        busId: bus.id,
        driverId,
        events: [],
        maxSpeed: bus.speed,
        avgSpeed: bus.speed,
        overspeedCount: 0,
        totalOverspeedDuration: 0,
      };
      this.speedHistory.set(bus.id, history);
      this.speedEvents.set(bus.id, []);
    });
  }

  // Determine speed status based on current speed
  getSpeedStatus(speed: number): 'normal' | 'warning' | 'overspeed' {
    if (speed >= OVERSPEED_THRESHOLD) return 'overspeed';
    if (speed >= WARNING_THRESHOLD) return 'warning';
    return 'normal';
  }

  // Get severity level for speed event
  getSpeedSeverity(speed: number): 'normal' | 'warning' | 'overspeed' {
    if (speed >= OVERSPEED_THRESHOLD) return 'overspeed';
    if (speed >= WARNING_THRESHOLD) return 'warning';
    return 'normal';
  }

  // Record a speed event
  recordSpeedEvent(
    busId: string,
    speed: number,
    location: { lat: number; lng: number },
    routeId?: string
  ): SpeedEvent | null {
    const severity = this.getSpeedSeverity(speed);
    
    if (severity === 'normal') return null;

    const history = this.speedHistory.get(busId);
    const driverId = history?.driverId || `D${busId.split('-')[1]}`;

    const event: SpeedEvent = {
      id: `speed-${busId}-${Date.now()}`,
      busId,
      driverId,
      routeId,
      timestamp: Date.now(),
      speed,
      speedLimit: SPEED_LIMIT_KMH,
      severity,
      duration: 0, // Will be updated when event ends
      location,
    };

    const events = this.speedEvents.get(busId) || [];
    events.push(event);
    this.speedEvents.set(busId, events);

    // Update speed history
    if (history) {
      history.events.push(event);
      if (speed > history.maxSpeed) {
        history.maxSpeed = speed;
      }
      if (severity === 'overspeed') {
        history.overspeedCount++;
      }
      this.speedHistory.set(busId, history);
    }

    return event;
  }

  // Get current speed monitoring data for a bus
  getSpeedMonitoringData(busId: string): SpeedMonitoringData {
    const bus = mockBuses.find(b => b.id === busId);
    if (!bus) {
      return {
        currentSpeed: 0,
        speedLimit: SPEED_LIMIT_KMH,
        status: 'normal',
        overspeedEvents: [],
        maxRecordedSpeed: 0,
        averageSpeed: 0,
        overspeedCount: 0,
      };
    }

    const history = this.speedHistory.get(busId);
    const events = this.speedEvents.get(busId) || [];

    return {
      currentSpeed: bus.speed,
      speedLimit: SPEED_LIMIT_KMH,
      status: this.getSpeedStatus(bus.speed),
      overspeedEvents: events.filter(e => e.severity === 'overspeed'),
      maxRecordedSpeed: history?.maxSpeed || bus.speed,
      averageSpeed: history?.avgSpeed || bus.speed,
      overspeedCount: history?.overspeedCount || 0,
    };
  }

  // Get speed history for a bus
  getSpeedHistory(busId: string): SpeedHistory | null {
    return this.speedHistory.get(busId) || null;
  }

  // Get all speed events for a driver
  getDriverSpeedEvents(driverId: string): SpeedEvent[] {
    const allEvents: SpeedEvent[] = [];
    this.speedEvents.forEach(events => {
      events.forEach(event => {
        if (event.driverId === driverId) {
          allEvents.push(event);
        }
      });
    });
    return allEvents.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get overspeeding vehicles
  getOverspeedingVehicles(): string[] {
    const overspeeding: string[] = [];
    mockBuses.forEach(bus => {
      if (bus.speed >= OVERSPEED_THRESHOLD) {
        overspeeding.push(bus.id);
      }
    });
    return overspeeding;
  }

  // Get vehicles with warning status
  getWarningVehicles(): string[] {
    const warning: string[] = [];
    mockBuses.forEach(bus => {
      if (bus.speed >= WARNING_THRESHOLD && bus.speed < OVERSPEED_THRESHOLD) {
        warning.push(bus.id);
      }
    });
    return warning;
  }

  // Calculate average speed for a bus
  calculateAverageSpeed(busId: string): number {
    const history = this.speedHistory.get(busId);
    if (!history || history.events.length === 0) {
      const bus = mockBuses.find(b => b.id === busId);
      return bus?.speed || 0;
    }

    const totalSpeed = history.events.reduce((sum, event) => sum + event.speed, 0);
    return totalSpeed / history.events.length;
  }

  // Get fleet speed summary
  getFleetSpeedSummary() {
    const totalSpeed = mockBuses.reduce((sum, bus) => sum + bus.speed, 0);
    const averageSpeed = totalSpeed / mockBuses.length;
    const overspeedCount = mockBuses.filter(b => b.speed >= OVERSPEED_THRESHOLD).length;
    const warningCount = mockBuses.filter(b => b.speed >= WARNING_THRESHOLD && b.speed < OVERSPEED_THRESHOLD).length;

    return {
      averageSpeed,
      overspeedCount,
      warningCount,
      normalCount: mockBuses.length - overspeedCount - warningCount,
    };
  }
}

export const speedMonitoringService = new SpeedMonitoringService();
