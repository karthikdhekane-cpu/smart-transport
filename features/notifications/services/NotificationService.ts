// Notification Service - Centralized notification management
// Handles in-app notifications, browser notifications, and state management

import type { INotificationService } from '../types';
import { 
  NOTIFICATION_PRIORITIES, 
  NOTIFICATION_ICONS, 
  NOTIFICATION_COLORS,
  NOTIFICATION_BG_COLORS,
  DELAY_REASON_TEXT,
  ETA_ALERT_CHANGE_THRESHOLD,
  DELAY_ALERT_MINUTES_THRESHOLD,
  ARRIVAL_THRESHOLDS,
} from '../mock/constants';

// Local storage keys
const STORAGE_KEYS = {
  NOTIFICATIONS: 'campbus_notifications',
  PREFERENCES: 'campbus_preferences',
  FOLLOWED_BUSES: 'campbus_followed_buses',
  ARRIVAL_STATE: 'campbus_arrival_state',
  ROUTE_STATE: 'campbus_route_state',
  STUDENT_STATUS: 'campbus_student_status',
};

// Mock initial data
const initialNotifications: import('../types').NotificationItem[] = [
  {
    id: 'n1',
    type: 'TRIP_STARTED',
    title: 'Trip Started',
    message: 'Route A — Gandhipuram Loop has started',
    timestamp: Date.now() - 18 * 60 * 1000,
    read: true,
    priority: 'normal',
    channel: 'in-app',
    severity: 'info',
    busId: 'BUS-01',
    busNumber: 'TN 38 AB 1234',
    routeId: 'route-a',
    routeName: 'Route A — Gandhipuram Loop',
  },
  {
    id: 'n2',
    type: 'BUS_ARRIVED',
    title: 'Bus Arrived',
    message: 'BUS-01 has arrived at Gandhipuram Bus Stand',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    read: true,
    priority: 'high',
    channel: 'in-app',
    severity: 'success',
    busId: 'BUS-01',
    busNumber: 'TN 38 AB 1234',
    routeId: 'route-a',
    routeName: 'Route A — Gandhipuram Loop',
    stopId: 'stop-a1',
    stopName: 'Gandhipuram Bus Stand',
  },
];

const initialPreferences: import('../types').NotificationPreferences = {
  arrivalAlerts: true,
  etaUpdates: true,
  delayAlerts: true,
  tripUpdates: true,
  browserNotifications: false,
};

// In-memory storage
let notifications: import('../types').NotificationItem[] = [];
let preferences: import('../types').NotificationPreferences = initialPreferences;
let followedBuses: import('../types').FollowedBusPreference[] = [];
let arrivalState: Record<string, { state: import('../types').BusArrivalState; lastNotificationTime: number; etaAtLastNotification?: number }> = {};
let routeState: Record<string, { currentRouteId: string; currentRouteName: string; lastNotificationTime: number }> = {};
let studentStatus: Record<string, { status: 'waiting' | 'picked_up' | 'on_bus' | 'dropped_off'; lastNotificationTime: number }> = {};

// Browser environment check
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Load from localStorage on init - browser only
function loadFromStorage() {
  if (!isBrowser) return;

  try {
    const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const storedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    const storedFollowedBuses = localStorage.getItem(STORAGE_KEYS.FOLLOWED_BUSES);
    const storedArrivalState = localStorage.getItem(STORAGE_KEYS.ARRIVAL_STATE);
    const storedRouteState = localStorage.getItem(STORAGE_KEYS.ROUTE_STATE);
    const storedStudentStatus = localStorage.getItem(STORAGE_KEYS.STUDENT_STATUS);

    if (storedNotifications) {
      notifications = JSON.parse(storedNotifications);
      return;
    }
  } catch (e) {
    // Silent fail for SSR - use initial data
  }

  // SSR or error - use initial data
  notifications = [...initialNotifications];
}

function saveToStorage() {
  if (!isBrowser) return;

  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    localStorage.setItem(STORAGE_KEYS.FOLLOWED_BUSES, JSON.stringify(followedBuses));
    localStorage.setItem(STORAGE_KEYS.ARRIVAL_STATE, JSON.stringify(arrivalState));
    localStorage.setItem(STORAGE_KEYS.ROUTE_STATE, JSON.stringify(routeState));
    localStorage.setItem(STORAGE_KEYS.STUDENT_STATUS, JSON.stringify(studentStatus));
  } catch (e) {
    // Silent fail for SSR
  }
}

class NotificationService implements INotificationService {
  constructor() {
    loadFromStorage();
  }

  // Get all notifications
  getAllNotifications(): import('../types').NotificationItem[] {
    return [...notifications].sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get unread notifications
  getUnreadNotifications(): import('../types').NotificationItem[] {
    return this.getAllNotifications().filter(n => !n.read);
  }

  // Get notification by ID
  getNotificationById(id: string): import('../types').NotificationItem | undefined {
    return notifications.find(n => n.id === id);
  }

  // Generate a new notification and return its ID
  generateNotification(notification: Omit<import('../types').NotificationItem, 'id' | 'timestamp' | 'read'>): string {
    // Check for duplicate BUS_DELAYED notifications based on identity: busId + routeId + delayMinutes + delayReason
    if (notification.type === 'BUS_DELAYED' && notification.busId && notification.routeId && notification.delayMinutes !== undefined && notification.delayReason !== undefined) {
      const existingNotification = notifications.find(n => 
        n.type === 'BUS_DELAYED' &&
        n.busId === notification.busId &&
        n.routeId === notification.routeId &&
        n.delayMinutes === notification.delayMinutes &&
        n.delayReason === notification.delayReason
      );
      
      // If an identical delay notification already exists, return its ID without creating a duplicate
      if (existingNotification) {
        return existingNotification.id;
      }
    }
    
    const id = `n${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: import('../types').NotificationItem = {
      ...notification,
      id,
      timestamp: Date.now(),
      read: false,
    };
    notifications.push(newNotification);
    saveToStorage();
    return id;
  }

  // Generate arrival alert based on bus position and ETA
  generateArrivalAlert(
    busId: string,
    stopId: string,
    etaSeconds: number,
    routeId: string,
    routeName: string,
    stopName: string
  ): string | null {
    // Check if notifications are enabled
    if (!preferences.arrivalAlerts) return null;
    if (!this.isBusFollowing(busId, stopId)) return null;

    const currentState = this.determineArrivalState(etaSeconds);
    const previousState = arrivalState[`${busId}:${stopId}`]?.state;

    // Skip if same state
    if (currentState === previousState) return null;

    // Update state
    arrivalState[`${busId}:${stopId}`] = {
      state: currentState,
      lastNotificationTime: Date.now(),
      etaAtLastNotification: etaSeconds,
    };
    saveToStorage();

    // Generate notification based on state
    if (currentState === 'ARRIVED') {
      return this.generateNotification({
        type: 'BUS_ARRIVED',
        title: 'Bus Arrived',
        message: `Bus ${this.getBusNumber(busId)} has arrived at ${stopName}`,
        priority: 'high',
        severity: 'success',
        channel: 'in-app',
        busId,
        busNumber: this.getBusNumber(busId),
        routeId,
        routeName,
        stopId,
        stopName,
        etaSeconds,
      });
    }

    // Generate appropriate notification for other states
    switch (currentState) {
      case 'ARRIVING':
        return this.generateNotification({
          type: 'BUS_ARRIVING',
          title: 'Bus Arriving Soon',
          message: `Bus ${this.getBusNumber(busId)} is arriving at ${stopName}`,
          priority: 'high',
          severity: 'info',
          channel: 'in-app',
          busId,
          busNumber: this.getBusNumber(busId),
          routeId,
          routeName,
          stopId,
          stopName,
          etaSeconds,
        });
      case 'NEAR':
        return this.generateNotification({
          type: 'BUS_APPROACHING',
          title: 'Bus Approaching',
          message: `Bus ${this.getBusNumber(busId)} is approximately ${Math.round(etaSeconds / 60)} minutes away from ${stopName}`,
          priority: 'normal',
          severity: 'info',
          channel: 'in-app',
          busId,
          busNumber: this.getBusNumber(busId),
          routeId,
          routeName,
          stopId,
          stopName,
          etaSeconds,
        });
      case 'APPROACHING':
        return this.generateNotification({
          type: 'BUS_APPROACHING',
          title: 'Bus Approaching',
          message: `Bus ${this.getBusNumber(busId)} is approximately ${Math.round(etaSeconds / 60)} minutes away from ${stopName}`,
          priority: 'normal',
          severity: 'info',
          channel: 'in-app',
          busId,
          busNumber: this.getBusNumber(busId),
          routeId,
          routeName,
          stopId,
          stopName,
          etaSeconds,
        });
    }

    return null;
  }

  // Generate departure alert when bus leaves stop
  generateDepartureAlert(
    busId: string,
    stopId: string,
    routeId: string,
    routeName: string,
    stopName: string
  ): string | null {
    if (!preferences.arrivalAlerts) return null;

    // Clear arrival state for this bus/stop
    delete arrivalState[`${busId}:${stopId}`];
    saveToStorage();

    return this.generateNotification({
      type: 'BUS_DEPARTED',
      title: 'Bus Departed',
      message: `Bus ${this.getBusNumber(busId)} has departed from ${stopName}`,
      priority: 'normal',
      severity: 'info',
      channel: 'in-app',
      busId,
      busNumber: this.getBusNumber(busId),
      routeId,
      routeName,
      stopId,
      stopName,
    });
  }

  // Generate ETA delta notification when ETA changes significantly
  generateETADeltaAlert(
    busId: string,
    previousETA: number,
    currentETA: number,
    delayReason: string
  ): string | null {
    if (!preferences.etaUpdates) return null;

    const deltaMinutes = Math.abs(currentETA - previousETA) / 60;

    // Only notify if change is significant
    if (deltaMinutes < ETA_ALERT_CHANGE_THRESHOLD / 60) return null;

    const direction = currentETA > previousETA ? 'increased by' : 'decreased by';
    const changeMinutes = Math.round(deltaMinutes);

    return this.generateNotification({
      type: 'ETA_CHANGED',
      title: 'ETA Updated',
      message: `Bus ${this.getBusNumber(busId)} is now expected in ${Math.round(currentETA / 60)} minutes. ETA ${direction} ${changeMinutes} minutes${delayReason ? ` due to ${this.getDelayReasonText(delayReason)}` : ''}.`,
      priority: 'normal',
      severity: delayReason ? 'warning' : 'info',
      channel: 'in-app',
      busId,
      busNumber: this.getBusNumber(busId),
      etaSeconds: currentETA,
    });
  }

  // Generate delay notification when bus is delayed
  generateDelayAlert(
    busId: string,
    delayMinutes: number,
    delayReason: string,
    routeId: string
  ): string | null {
    if (!preferences.delayAlerts) return null;
    if (delayMinutes < DELAY_ALERT_MINUTES_THRESHOLD) return null;

    return this.generateNotification({
      type: 'BUS_DELAYED',
      title: 'Bus Delayed',
      message: `Your bus is delayed by approximately ${delayMinutes} minutes due to ${this.getDelayReasonText(delayReason)}`,
      priority: 'high',
      severity: 'warning',
      channel: 'in-app',
      busId,
      busNumber: this.getBusNumber(busId),
      routeId,
      routeName: this.getRouteName(routeId),
      delayMinutes,
      delayReason,
    });
  }

  // Generate route change notification when student's assigned route changes
  generateRouteChangeAlert(
    busId: string,
    previousRouteId: string,
    previousRouteName: string,
    newRouteId: string,
    newRouteName: string,
    reason?: string
  ): string | null {
    // Check for duplicate route change notifications based on identity: busId + previousRouteId + newRouteId
    const existingNotification = notifications.find(n => 
      n.type === 'ROUTE_CHANGED' &&
      n.busId === busId &&
      n.routeId === newRouteId &&
      n.message.includes(previousRouteName) &&
      n.message.includes(newRouteName)
    );
    
    // If an identical route change notification already exists, return its ID without creating a duplicate
    if (existingNotification) {
      return existingNotification.id;
    }

    const reasonText = reason ? ` due to ${reason}` : '';
    return this.generateNotification({
      type: 'ROUTE_CHANGED',
      title: 'Route Changed',
      message: `Your bus route has been changed from ${previousRouteName} to ${newRouteName}.${reasonText}`,
      priority: 'high',
      severity: 'info',
      channel: 'in-app',
      busId,
      busNumber: this.getBusNumber(busId),
      routeId: newRouteId,
      routeName: newRouteName,
    });
  }

  // Track route change and generate notification if route changed
  trackRouteChange(
    busId: string,
    newRouteId: string,
    newRouteName: string,
    reason?: string
  ): string | null {
    const currentRouteState = routeState[busId];
    
    // If no previous route state, initialize it without notification
    if (!currentRouteState) {
      routeState[busId] = {
        currentRouteId: newRouteId,
        currentRouteName: newRouteName,
        lastNotificationTime: Date.now(),
      };
      saveToStorage();
      return null;
    }
    
    // If route hasn't changed, do nothing
    if (currentRouteState.currentRouteId === newRouteId) {
      return null;
    }
    
    // Route changed - generate notification
    const notificationId = this.generateRouteChangeAlert(
      busId,
      currentRouteState.currentRouteId,
      currentRouteState.currentRouteName,
      newRouteId,
      newRouteName,
      reason
    );
    
    // Update route state
    if (notificationId) {
      routeState[busId] = {
        currentRouteId: newRouteId,
        currentRouteName: newRouteName,
        lastNotificationTime: Date.now(),
      };
      saveToStorage();
    }
    
    return notificationId;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications[index] = { ...notifications[index], read: true };
      saveToStorage();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    notifications = notifications.map(n => ({ ...n, read: true }));
    saveToStorage();
  }

  // Mark all notifications for a route as read
  markRouteAsRead(routeId: string): void {
    notifications = notifications.map(n => 
      n.routeId === routeId ? { ...n, read: true } : n
    );
    saveToStorage();
  }

  // Get notification preferences
  getPreferences(): import('../types').NotificationPreferences {
    return { ...preferences };
  }

  // Update notification preferences
  updatePreferences(prefs: Partial<import('../types').NotificationPreferences>): void {
    preferences = { ...preferences, ...prefs };
    saveToStorage();
  }

  // Get followed buses
  getFollowedBuses(): import('../types').FollowedBusPreference[] {
    return [...followedBuses];
  }

  // Follow a bus
  followBus(preference: import('../types').FollowedBusPreference): void {
    const index = followedBuses.findIndex(b => b.busId === preference.busId);
    if (index !== -1) {
      followedBuses[index] = preference;
    } else {
      followedBuses.push(preference);
    }
    saveToStorage();
  }

  // Unfollow a bus
  unfollowBus(busId: string): void {
    followedBuses = followedBuses.filter(b => b.busId !== busId);
    saveToStorage();
  }

  // Check if bus is being followed
  isBusFollowing(busId: string, stopId?: string): boolean {
    return followedBuses.some(b => 
      b.busId === busId && (!stopId || b.stopId === stopId)
    );
  }

  // Determine arrival state based on ETA
  determineArrivalState(etaSeconds: number): import('../types').BusArrivalState {
    if (etaSeconds <= ARRIVAL_THRESHOLDS.ARRIVING) return 'ARRIVING';
    if (etaSeconds <= ARRIVAL_THRESHOLDS.NEAR) return 'NEAR';
    if (etaSeconds <= ARRIVAL_THRESHOLDS.APPROACHING) return 'APPROACHING';
    return 'FAR';
  }

  // Get bus number by ID
  getBusNumber(busId: string): string {
    // Mock implementation - would fetch from actual bus data
    const mockBusNumbers: Record<string, string> = {
      'BUS-01': 'TN 38 AB 1234',
      'BUS-02': 'TN 38 CD 5678',
      'BUS-03': 'TN 38 EF 9012',
      'BUS-04': 'TN 38 GH 3456',
      'BUS-05': 'TN 38 HI 7890',
      'BUS-06': 'TN 38 JK 2345',
    };
    return mockBusNumbers[busId] || busId;
  }

  // Get route name by ID
  getRouteName(routeId: string): string {
    const mockRouteNames: Record<string, string> = {
      'route-a': 'Route A — Gandhipuram Loop',
      'route-b': 'Route B — RS Puram Express',
      'route-c': 'Route C — Peelamedu Circuit',
      'route-d': 'Route D — Singanallur Terminal',
    };
    return mockRouteNames[routeId] || routeId;
  }

  // Get delay reason text
  getDelayReasonText(reason: string): string {
    return DELAY_REASON_TEXT[reason] || 'Unknown delay';
  }

  // Request browser notification permission - browser only
  requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return Promise.resolve(false);
    }

    if (window.Notification.permission === 'granted') {
      return Promise.resolve(true);
    }

    if (window.Notification.permission === 'denied') {
      return Promise.resolve(false);
    }

    return window.Notification.requestPermission().then(permission => permission === 'granted');
  }

  // Check if permission is granted - browser only
  isPermissionGranted(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted';
  }

  // Show browser notification - browser only
  showBrowserNotification(notification: import('../types').NotificationItem): void {
    if (!isBrowser || !this.isPermissionGranted()) return;

    const options: NotificationOptions = {
      body: notification.message,
      icon: NOTIFICATION_ICONS[notification.type] || 'ℹ️',
      badge: '🔔',
      silent: notification.priority === 'low',
      tag: notification.id,
    };

    // Clear any existing notification with same tag
    try {
      (window.Notification as any).getNotifications({ tag: notification.id }).then((notifications: any[]) => {
        notifications.forEach(n => n.close());
      });
    } catch (e) {
      // getNotifications may not be available in all browsers
    }

    new window.Notification(notification.title, options);
  }

  // Check if browser notifications are supported - browser only
  isBrowserNotificationsSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && 'permission' in window.Notification;
  }

  // Get notification color by type
  getNotificationColor(type: string): string {
    return NOTIFICATION_COLORS[type] || 'text-gray-400';
  }

  // Get notification background color by type
  getNotificationBgColor(type: string): string {
    return NOTIFICATION_BG_COLORS[type] || 'bg-gray-100/10';
  }

  // Get notification icon by type
  getNotificationIcon(type: string): string {
    return NOTIFICATION_ICONS[type] || 'ℹ️';
  }

  // Get notification priority by type
  getNotificationPriority(type: string): import('../types').NotificationPriority {
    return NOTIFICATION_PRIORITIES[type] || 'normal';
  }

  // Cleanup
  cleanup(): void {
    // Clear in-memory storage
    notifications = [];
    followedBuses = [];
    arrivalState = {};
    routeState = {};
    studentStatus = {};
  }

  // Generate student pickup notification
  generateStudentPickupNotification(
    studentId: string,
    studentName: string,
    busId: string,
    stopName: string
  ): string | null {
    // Check for duplicate pickup notifications
    const existingNotification = notifications.find(n => 
      n.type === 'STUDENT_PICKED_UP' &&
      n.message.includes(studentName) &&
      n.message.includes(stopName)
    );
    
    if (existingNotification) {
      return existingNotification.id;
    }

    return this.generateNotification({
      type: 'STUDENT_PICKED_UP',
      title: 'Student Picked Up',
      message: `${studentName} has been picked up by the bus at ${stopName}`,
      priority: 'high',
      severity: 'success',
      channel: 'in-app',
      busId,
      busNumber: this.getBusNumber(busId),
    });
  }

  // Generate student drop-off notification
  generateStudentDropOffNotification(
    studentId: string,
    studentName: string,
    busId: string,
    stopName: string
  ): string | null {
    // Check for duplicate drop-off notifications
    const existingNotification = notifications.find(n => 
      n.type === 'STUDENT_DROPPED_OFF' &&
      n.message.includes(studentName) &&
      n.message.includes(stopName)
    );
    
    if (existingNotification) {
      return existingNotification.id;
    }

    return this.generateNotification({
      type: 'STUDENT_DROPPED_OFF',
      title: 'Student Dropped Off',
      message: `${studentName} has been dropped off at ${stopName}`,
      priority: 'high',
      severity: 'success',
      channel: 'in-app',
      busId,
      busNumber: this.getBusNumber(busId),
    });
  }

  // Track student status and generate notifications on status changes
  trackStudentStatus(
    studentId: string,
    studentName: string,
    busId: string,
    newStatus: 'waiting' | 'picked_up' | 'on_bus' | 'dropped_off',
    stopName?: string
  ): string | null {
    const currentStatus = studentStatus[studentId];
    
    // If no previous status, initialize it without notification
    if (!currentStatus) {
      studentStatus[studentId] = {
        status: newStatus,
        lastNotificationTime: Date.now(),
      };
      saveToStorage();
      return null;
    }
    
    // If status hasn't changed, do nothing
    if (currentStatus.status === newStatus) {
      return null;
    }
    
    // Status changed - generate notification for pickup/drop
    let notificationId: string | null = null;
    
    if (newStatus === 'picked_up' && currentStatus.status === 'waiting' && stopName) {
      notificationId = this.generateStudentPickupNotification(studentId, studentName, busId, stopName);
    } else if (newStatus === 'dropped_off' && stopName) {
      notificationId = this.generateStudentDropOffNotification(studentId, studentName, busId, stopName);
    }
    
    // Update student status
    if (notificationId) {
      studentStatus[studentId] = {
        status: newStatus,
        lastNotificationTime: Date.now(),
      };
      saveToStorage();
    }
    
    return notificationId;
  }

  // Get student current status
  getStudentStatus(studentId: string): 'waiting' | 'picked_up' | 'on_bus' | 'dropped_off' | null {
    return studentStatus[studentId]?.status || null;
  }
}

// Export singleton instance - lazy initialization to avoid SSR issues
let notificationServiceInstance: NotificationService | null = null;

export const notificationService = (() => {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService();
  }
  return notificationServiceInstance;
})();
