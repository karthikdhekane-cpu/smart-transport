// Mock notification constants

// Time-based thresholds for arrival alerts (in seconds)
export const ARRIVAL_THRESHOLDS = {
  FAR: 600,        // 10 minutes - far away
  APPROACHING: 600, // 10 minutes - approaching warning
  NEAR: 300,       // 5 minutes - near warning
  ARRIVING: 120,   // 2 minutes - arriving warning
} as const;

// ETA change threshold for notifications (in seconds)
export const ETA_ALERT_CHANGE_THRESHOLD = 120; // 2 minutes

// Delay threshold for notifications (in minutes)
export const DELAY_ALERT_MINUTES_THRESHOLD = 2;

// Notification priorities by type
export const NOTIFICATION_PRIORITIES: Record<string, 'low' | 'normal' | 'high' | 'critical'> = {
  TRIP_COMPLETED: 'low',
  TRIP_STARTED: 'normal',
  ETA_CHANGED: 'normal',
  BUS_APPROACHING: 'normal',
  BUS_ARRIVING: 'high',
  BUS_ARRIVED: 'high',
  BUS_DEPARTED: 'normal',
  BUS_DELAYED: 'high',
  TRAFFIC_DELAY: 'high',
  ROUTE_CHANGED: 'high',
  STUDENT_PICKED_UP: 'high',
  STUDENT_DROPPED_OFF: 'high',
  SYSTEM: 'critical',
};

// Notification icons
export const NOTIFICATION_ICONS: Record<string, string> = {
  TRIP_COMPLETED: '🏁',
  TRIP_STARTED: '▶️',
  ETA_CHANGED: '⏱️',
  BUS_APPROACHING: '🚌',
  BUS_ARRIVING: '🚌',
  BUS_ARRIVED: '✅',
  BUS_DEPARTED: '▶️',
  BUS_DELAYED: '⚠️',
  TRAFFIC_DELAY: '🚧',
  ROUTE_CHANGED: '🔄',
  STUDENT_PICKED_UP: '👤',
  STUDENT_DROPPED_OFF: '🏠',
  SYSTEM: 'ℹ️',
};

// Notification colors
export const NOTIFICATION_COLORS: Record<string, string> = {
  TRIP_COMPLETED: 'text-gray-400',
  TRIP_STARTED: 'text-[#00C853]',
  ETA_CHANGED: 'text-[#FFD700]',
  BUS_APPROACHING: 'text-[#FFD700]',
  BUS_ARRIVING: 'text-[#FF5722]',
  BUS_ARRIVED: 'text-[#00C853]',
  BUS_DEPARTED: 'text-[#9E9E9E]',
  BUS_DELAYED: 'text-red-500',
  TRAFFIC_DELAY: 'text-[#FF9800]',
  ROUTE_CHANGED: 'text-[#9C27B0]',
  STUDENT_PICKED_UP: 'text-[#00C853]',
  STUDENT_DROPPED_OFF: 'text-[#2196F3]',
  SYSTEM: 'text-blue-400',
};

// Notification background colors
export const NOTIFICATION_BG_COLORS: Record<string, string> = {
  TRIP_COMPLETED: 'bg-gray-100/10',
  TRIP_STARTED: 'bg-[#00C853]/10',
  ETA_CHANGED: 'bg-[#FFD700]/10',
  BUS_APPROACHING: 'bg-[#FFD700]/10',
  BUS_ARRIVING: 'bg-[#FF5722]/10',
  BUS_ARRIVED: 'bg-[#00C853]/10',
  BUS_DEPARTED: 'bg-gray-500/10',
  BUS_DELAYED: 'bg-red-500/10',
  TRAFFIC_DELAY: 'bg-[#FF9800]/10',
  ROUTE_CHANGED: 'bg-[#9C27B0]/10',
  STUDENT_PICKED_UP: 'bg-[#00C853]/10',
  STUDENT_DROPPED_OFF: 'bg-[#2196F3]/10',
  SYSTEM: 'bg-blue-400/10',
};

// Mock delay reason translations
export const DELAY_REASON_TEXT: Record<string, string> = {
  traffic: 'Traffic congestion',
  'road-work': 'Road work ahead',
  signal: 'Signal delay',
  'student-boarding': 'Student boarding',
  rain: 'Weather conditions',
  accident: 'Accident reported',
  none: '',
  operational: 'Operational delay',
};
