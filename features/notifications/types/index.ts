// Notification Types for Push Notifications and Bus Arrival Alerts

// === Notification Priority ===
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

// === Notification Types ===
export type NotificationType = 
  | 'BUS_APPROACHING'
  | 'BUS_ARRIVING'
  | 'BUS_ARRIVED'
  | 'BUS_DEPARTED'
  | 'BUS_DELAYED'
  | 'ETA_CHANGED'
  | 'TRAFFIC_DELAY'
  | 'TRIP_STARTED'
  | 'TRIP_COMPLETED'
  | 'ROUTE_CHANGED'
  | 'STUDENT_PICKED_UP'
  | 'STUDENT_DROPPED_OFF'
  | 'SYSTEM';

// === Notification Severity ===
export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success';

// === Notification Channel ===
export type NotificationChannel = 'in-app' | 'browser' | 'push';

// === Bus Arrival State ===
export type BusArrivalState = 
  | 'FAR'           // ETA > 10 minutes
  | 'APPROACHING'   // ETA <= 10 minutes
  | 'NEAR'          // ETA <= 5 minutes
  | 'ARRIVING'      // ETA <= 2 minutes
  | 'ARRIVED'       // Bus has reached the stop
  | 'DEPARTED';     // Bus has left the stop

// === Notification Interface ===
export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: NotificationPriority;
  busId?: string;
  busNumber?: string;
  routeId?: string;
  routeName?: string;
  stopId?: string;
  stopName?: string;
  etaSeconds?: number;
  severity: NotificationSeverity;
  channel: NotificationChannel;
  action?: NotificationAction;
  
  // Delay-specific metadata for BUS_DELAYED notifications
  delayMinutes?: number;
  delayReason?: string;
}

// === Notification Action ===
export interface NotificationAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

// === Notification Preferences ===
export interface NotificationPreferences {
  arrivalAlerts: boolean;
  etaUpdates: boolean;
  delayAlerts: boolean;
  tripUpdates: boolean;
  browserNotifications: boolean;
}

// === Followed Bus Preference ===
export interface FollowedBusPreference {
  busId: string;
  routeId: string;
  stopId: string;
  arrivalAlertsEnabled: boolean;
  etaAlertsEnabled: boolean;
  delayAlertsEnabled: boolean;
}

// === Bus Arrival State Tracking ===
export interface BusArrivalStateTracking {
  busId: string;
  stopId: string;
  state: BusArrivalState;
  lastNotificationTime: number;
  etaAtLastNotification?: number;
}

// === Notification Service Interface ===
export interface INotificationService {
  // State management
  getAllNotifications(): NotificationItem[];
  getUnreadNotifications(): NotificationItem[];
  getNotificationById(id: string): NotificationItem | undefined;
  
  // Notification generation
  generateNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): string;
  generateArrivalAlert(busId: string, stopId: string, etaSeconds: number, routeId: string, routeName: string, stopName: string): string | null;
  generateDepartureAlert(busId: string, stopId: string, routeId: string, routeName: string, stopName: string): string | null;
  generateETADeltaAlert(busId: string, previousETA: number, currentETA: number, delayReason: string): string | null;
  generateDelayAlert(busId: string, delayMinutes: number, delayReason: string, routeId: string): string | null;
  generateRouteChangeAlert(busId: string, previousRouteId: string, previousRouteName: string, newRouteId: string, newRouteName: string, reason?: string): string | null;
  trackRouteChange(busId: string, newRouteId: string, newRouteName: string, reason?: string): string | null;
  generateStudentPickupNotification(studentId: string, studentName: string, busId: string, stopName: string): string | null;
  generateStudentDropOffNotification(studentId: string, studentName: string, busId: string, stopName: string): string | null;
  trackStudentStatus(studentId: string, studentName: string, busId: string, newStatus: 'waiting' | 'picked_up' | 'on_bus' | 'dropped_off', stopName?: string): string | null;
  getStudentStatus(studentId: string): 'waiting' | 'picked_up' | 'on_bus' | 'dropped_off' | null;
  
  // Actions
  markAsRead(notificationId: string): void;
  markAllAsRead(): void;
  markRouteAsRead(routeId: string): void;
  
  // Preferences
  getPreferences(): NotificationPreferences;
  updatePreferences(prefs: Partial<NotificationPreferences>): void;
  
  // Followed buses
  getFollowedBuses(): FollowedBusPreference[];
  followBus(preference: FollowedBusPreference): void;
  unfollowBus(busId: string): void;
  
  // Browser notifications
  requestPermission(): Promise<boolean>;
  isPermissionGranted(): boolean;
  showBrowserNotification(notification: NotificationItem): void;
  isBrowserNotificationsSupported(): boolean;
}
