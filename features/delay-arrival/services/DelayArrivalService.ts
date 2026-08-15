// Delay/Arrival Intelligence Service
// Determines on-time/delayed/early states and generates notifications

import { notificationService } from '@/features/notifications/services/NotificationService';

export type ArrivalState = 'on-time' | 'delayed' | 'early';

export interface DelayThreshold {
  warningMinutes: number;
  criticalMinutes: number;
}

export interface ArrivalStatus {
  busId: string;
  state: ArrivalState;
  delayMinutes: number;
  threshold: DelayThreshold;
  lastUpdated: number;
}

class DelayArrivalService {
  private arrivalStates: Map<string, ArrivalStatus> = new Map();
  private notificationHistory: Map<string, number> = new Map(); // busId -> last notification time
  private readonly NOTIFICATION_DEBOUNCE_MS = 60000; // 1 minute debounce
  private readonly DEFAULT_THRESHOLD: DelayThreshold = {
    warningMinutes: 5,
    criticalMinutes: 10
  };

  // Calculate arrival state based on ETA vs scheduled time
  calculateArrivalState(
    busId: string,
    etaSeconds: number,
    scheduledTimeSeconds: number,
    threshold?: DelayThreshold
  ): ArrivalStatus {
    const effectiveThreshold = threshold || this.DEFAULT_THRESHOLD;
    const delaySeconds = etaSeconds - scheduledTimeSeconds;
    const delayMinutes = Math.round(delaySeconds / 60);
    
    let state: ArrivalState = 'on-time';
    
    if (delayMinutes > effectiveThreshold.criticalMinutes) {
      state = 'delayed';
    } else if (delayMinutes < -2) { // More than 2 minutes early
      state = 'early';
    }

    const status: ArrivalStatus = {
      busId,
      state,
      delayMinutes,
      threshold: effectiveThreshold,
      lastUpdated: Date.now()
    };

    this.arrivalStates.set(busId, status);
    return status;
  }

  // Get current arrival state for a bus
  getArrivalState(busId: string): ArrivalStatus | null {
    return this.arrivalStates.get(busId) || null;
  }

  // Check if delay notification should be generated
  shouldGenerateDelayNotification(busId: string, newStatus: ArrivalStatus): boolean {
    const lastNotificationTime = this.notificationHistory.get(busId) || 0;
    const now = Date.now();
    
    // Debounce: don't notify if we notified recently
    if (now - lastNotificationTime < this.NOTIFICATION_DEBOUNCE_MS) {
      return false;
    }

    // Only notify if state changed to delayed or delay increased significantly
    const previousStatus = this.arrivalStates.get(busId);
    
    if (!previousStatus) {
      return newStatus.state === 'delayed';
    }

    // Notify if state changed to delayed
    if (previousStatus.state !== 'delayed' && newStatus.state === 'delayed') {
      return true;
    }

    // Notify if delay increased by at least 2 minutes while still delayed
    if (newStatus.state === 'delayed' && previousStatus.state === 'delayed') {
      const delayIncrease = newStatus.delayMinutes - previousStatus.delayMinutes;
      return delayIncrease >= 2;
    }

    return false;
  }

  // Generate delay notification
  generateDelayNotification(busId: string, status: ArrivalStatus, routeName: string, stopName: string): string | null {
    if (!this.shouldGenerateDelayNotification(busId, status)) {
      return null;
    }

    const severity = status.delayMinutes >= status.threshold.criticalMinutes ? 'critical' : 'warning';
    const message = `Bus ${busId} is ${status.delayMinutes} minutes ${status.state === 'early' ? 'early' : 'delayed'} arriving at ${stopName} on ${routeName}`;

    const notificationId = notificationService.generateNotification({
      type: 'BUS_DELAYED',
      title: status.state === 'early' ? 'Bus Arriving Early' : 'Bus Delayed',
      message,
      priority: severity === 'critical' ? 'high' : 'normal',
      severity: severity as any,
      channel: 'in-app',
      busId,
      busNumber: busId
    });

    if (notificationId) {
      this.notificationHistory.set(busId, Date.now());
    }

    return notificationId;
  }

  // Generate on-time recovery notification
  generateOnTimeRecoveryNotification(busId: string, routeName: string, stopName: string): string | null {
    const previousStatus = this.arrivalStates.get(busId);
    
    if (!previousStatus || previousStatus.state === 'on-time') {
      return null;
    }

    const message = `Bus ${busId} is now on schedule for ${stopName} on ${routeName}`;

    const notificationId = notificationService.generateNotification({
      type: 'ETA_CHANGED',
      title: 'Bus On Schedule',
      message,
      priority: 'low',
      severity: 'success',
      channel: 'in-app',
      busId,
      busNumber: busId
    });

    if (notificationId) {
      this.notificationHistory.set(busId, Date.now());
    }

    return notificationId;
  }

  // Update and check for notifications
  updateAndNotify(
    busId: string,
    etaSeconds: number,
    scheduledTimeSeconds: number,
    routeName: string,
    stopName: string,
    threshold?: DelayThreshold
  ): { status: ArrivalStatus; notificationGenerated?: string } {
    const status = this.calculateArrivalState(busId, etaSeconds, scheduledTimeSeconds, threshold);
    
    const previousStatus = this.arrivalStates.get(busId);
    let notificationGenerated: string | undefined;

    // Check for delay notification
    if (status.state === 'delayed') {
      const notifId = this.generateDelayNotification(busId, status, routeName, stopName);
      if (notifId) notificationGenerated = notifId;
    }

    // Check for on-time recovery
    if (previousStatus?.state === 'delayed' && status.state === 'on-time') {
      const notifId = this.generateOnTimeRecoveryNotification(busId, routeName, stopName);
      if (notifId) notificationGenerated = notifId;
    }

    return { status, notificationGenerated };
  }

  // Clear notification history for a bus (useful for testing or manual reset)
  clearNotificationHistory(busId: string): void {
    this.notificationHistory.delete(busId);
  }

  // Get all arrival states
  getAllArrivalStates(): ArrivalStatus[] {
    return Array.from(this.arrivalStates.values());
  }
}

// Export singleton instance
export const delayArrivalService = new DelayArrivalService();
