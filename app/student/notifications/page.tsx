'use client';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { notificationService } from '@/features/notifications';

const navItems = [
  { href:'/student',          icon:'🏠', label:'Dashboard' },
  { href:'/student/tracking', icon:'🗺️', label:'Live Tracking' },
  { href:'/student/eta',      icon:'⏱️', label:'ETA & Alarm' },
  { href:'/student/notifications', icon:'🔔', label:'Notifications' },
  { href:'/student/lost-found',    icon:'📦', label:'Lost & Found' },
  { href:'/student/safety',        icon:'🛡️', label:'Safety' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<import('@/features/notifications/types').NotificationItem[]>(() => notificationService.getAllNotifications());
  const [filter, setFilter] = useState('all');
  const mountedRef = useRef(true);

  // Poll for notification updates
  useEffect(() => {
    mountedRef.current = true;
    setNotifications(notificationService.getAllNotifications());
    
    const intervalId = setInterval(() => {
      if (mountedRef.current) {
        setNotifications(notificationService.getAllNotifications());
      }
    }, 2000); // Poll every 2 seconds
    
    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
  }, []);

  const markAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(notificationService.getAllNotifications());
  };

  const markAllRead = () => {
    notificationService.markAllAsRead();
    setNotifications(notificationService.getAllNotifications());
  };

  const filtered = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(n => !n.read) 
      : notifications.filter(n => n.type === filter);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout role="student" navItems={navItems} userName="Priya Sharma">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Notifications 🔔</h1>
            <p className="text-gray-400 text-sm mt-1">{unreadCount} unread notifications</p>
          </div>
          <button onClick={markAllRead} className="glass text-sm text-gray-400 hover:text-white px-4 py-2 rounded-xl transition-all">
            Mark all read
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['all','unread','BUS_APPROACHING','BUS_ARRIVING','BUS_ARRIVED','BUS_DEPARTED','BUS_DELAYED','ETA_CHANGED','TRAFFIC_DELAY','TRIP_STARTED','TRIP_COMPLETED','ROUTE_CHANGED','STUDENT_PICKED_UP','STUDENT_DROPPED_OFF','SYSTEM'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter===f ? 'bg-[#00C853] text-black' : 'glass text-gray-400 hover:text-white'}`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">🔕</div>
              <p>No notifications in this category</p>
            </div>
          ) : (
            filtered.map(n => (
              <div 
                key={n.id} 
                className={`rounded-2xl p-4 flex items-start gap-4 hover-card ${!n.read ? 'glass-green' : 'glass opacity-70'}`}
              >
                <span className="text-2xl mt-0.5">
                  {notificationService.getNotificationIcon(n.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${notificationService.getNotificationColor(n.type)}`}>
                      {n.title}
                    </span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-[#00C853]"/>}
                  </div>
                  <p className="text-gray-300 text-sm">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(n.timestamp)}
                    </span>
                    {n.busNumber && <span className="text-xs glass px-2 py-0.5 rounded-full text-gray-400">
                      {n.busNumber}
                    </span>}
                  </div>
                </div>
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-gray-600 hover:text-white transition-colors text-lg"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Notification settings */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">⚙️ Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { label:'Bus arriving (5 min)', prefKey:'arrivalAlerts' as keyof import('@/features/notifications/types').NotificationPreferences },
              { label:'ETA updates', prefKey:'etaUpdates' as keyof import('@/features/notifications/types').NotificationPreferences },
              { label:'Delay alerts', prefKey:'delayAlerts' as keyof import('@/features/notifications/types').NotificationPreferences },
              { label:'Trip updates', prefKey:'tripUpdates' as keyof import('@/features/notifications/types').NotificationPreferences },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-gray-300">{s.label}</span>
                <NotificationToggle 
                  prefKey={s.prefKey} 
                  currentPrefs={notificationService.getPreferences()}
                  onUpdate={notificationService.updatePreferences.bind(notificationService)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper function to format time ago
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

// Notification toggle component
function NotificationToggle({ 
  prefKey, 
  currentPrefs, 
  onUpdate 
}: { 
  prefKey: keyof import('@/features/notifications/types').NotificationPreferences;
  currentPrefs: import('@/features/notifications/types').NotificationPreferences;
  onUpdate: (prefs: Partial<import('@/features/notifications/types').NotificationPreferences>) => void;
}) {
  const enabled = currentPrefs[prefKey];
  
  return (
    <div 
      className={`w-10 h-5 rounded-full transition-all cursor-pointer ${enabled ? 'bg-[#00C853]' : 'bg-white/10'}`}
      onClick={() => onUpdate({ [prefKey]: !enabled })}
    >
      <div className={`w-4 h-4 rounded-full bg-white m-0.5 transition-all ${enabled ? 'translate-x-5' : 'translate-x-0'}`}/>
    </div>
  );
}
