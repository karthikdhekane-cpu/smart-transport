// useNotifications Hook - Custom React hook for notification management
// Provides notification state, actions, and integration with Dynamic ETA

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { notificationService } from '../services/NotificationService';
import type { NotificationItem, NotificationType, BusArrivalState, FollowedBusPreference, NotificationPreferences } from '../types';
import { etaService } from '../../eta/services/ETAService';

interface UseNotificationsReturn {
  // State
  notifications: NotificationItem[];
  unreadCount: number;
  followedBuses: FollowedBusPreference[];
  preferences: NotificationPreferences;
  
  // Actions
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  markRouteAsRead: (routeId: string) => void;
  followBus: (preference: FollowedBusPreference) => void;
  unfollowBus: (busId: string) => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  requestBrowserPermission: () => Promise<boolean>;
  
  // Helper
  isBrowserNotificationsSupported: boolean;
  isPermissionGranted: boolean;
  getNotificationColor: (type: NotificationType) => string;
  getNotificationBgColor: (type: NotificationType) => string;
  getNotificationIcon: (type: NotificationType) => string;
}

const INITIAL_PREFERENCES: NotificationPreferences = {
  arrivalAlerts: true,
  etaUpdates: true,
  delayAlerts: true,
  tripUpdates: true,
  browserNotifications: false,
};

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => notificationService.getAllNotifications());
  const [followedBuses, setFollowedBuses] = useState<FollowedBusPreference[]>(() => notificationService.getFollowedBuses());
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => notificationService.getPreferences());
  const mountedRef = useRef(true);
  
  // Load initial data
  useEffect(() => {
    mountedRef.current = true;
    
    const loadedNotifications = notificationService.getAllNotifications();
    const loadedFollowedBuses = notificationService.getFollowedBuses();
    const loadedPreferences = notificationService.getPreferences();
    
    if (mountedRef.current) {
      setNotifications(loadedNotifications);
      setFollowedBuses(loadedFollowedBuses);
      setPreferences(loadedPreferences);
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Sync notifications when state changes
  useEffect(() => {
    if (!mountedRef.current) return;
    
    const handleNotificationsChange = () => {
      const updated = notificationService.getAllNotifications();
      setNotifications(updated);
    };
    
    // NotificationService would emit events - for now we use polling
    // This is handled by explicit calls from other hooks
    
    return () => {
      // Cleanup would go here if we had event listeners
    };
  }, []);

  // Actions
  const markAsRead = useCallback((notificationId: string) => {
    notificationService.markAsRead(notificationId);
    setNotifications(notificationService.getAllNotifications());
  }, []);

  const markAllAsRead = useCallback(() => {
    notificationService.markAllAsRead();
    setNotifications(notificationService.getAllNotifications());
  }, []);

  const markRouteAsRead = useCallback((routeId: string) => {
    notificationService.markRouteAsRead(routeId);
    setNotifications(notificationService.getAllNotifications());
  }, []);

  const followBus = useCallback((preference: FollowedBusPreference) => {
    notificationService.followBus(preference);
    setFollowedBuses(notificationService.getFollowedBuses());
  }, []);

  const unfollowBus = useCallback((busId: string) => {
    notificationService.unfollowBus(busId);
    setFollowedBuses(notificationService.getFollowedBuses());
  }, []);

  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    notificationService.updatePreferences(prefs);
    setPreferences(notificationService.getPreferences());
  }, []);

  const requestBrowserPermission = useCallback(async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      updatePreferences({ browserNotifications: true });
    } else {
      updatePreferences({ browserNotifications: false });
    }
    return granted;
  }, [updatePreferences]);

  // Computed values
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const isBrowserNotificationsSupported = notificationService.isBrowserNotificationsSupported();
  const isPermissionGranted = notificationService.isPermissionGranted();

  const getNotificationColor = useCallback((type: NotificationType) => {
    return notificationService.getNotificationColor(type);
  }, []);

  const getNotificationBgColor = useCallback((type: NotificationType) => {
    return notificationService.getNotificationBgColor(type);
  }, []);

  const getNotificationIcon = useCallback((type: NotificationType) => {
    return notificationService.getNotificationIcon(type);
  }, []);

  return {
    notifications,
    unreadCount,
    followedBuses,
    preferences,
    
    markAsRead,
    markAllAsRead,
    markRouteAsRead,
    followBus,
    unfollowBus,
    updatePreferences,
    requestBrowserPermission,
    
    isBrowserNotificationsSupported,
    isPermissionGranted,
    getNotificationColor,
    getNotificationBgColor,
    getNotificationIcon,
  };
}

// Helper function to sync notification state
function setNotifications(notifications: NotificationItem[]) {
  // This is a helper for the hook to update state
  // In a real implementation, this would use a proper state management pattern
  console.log('Notification count:', notifications.length);
}

export default useNotifications;
