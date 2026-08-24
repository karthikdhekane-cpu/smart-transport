// Activity Log Service
// Tracks administrative actions for audit purposes

import type { 
  ActivityLog, 
  ActivityLogService, 
  Severity, 
  ActionType,
  ActivityLogSummary 
} from '../types';

// Severity color mapping
const SEVERITY_COLORS: Record<Severity, string> = {
  info: 'text-blue-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
  success: 'text-emerald-400',
  critical: 'text-red-500',
};

// Severity icon mapping
const SEVERITY_ICONS: Record<Severity, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  success: '✅',
  critical: '🚨',
};

// Initial mock data
const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'al1',
    timestamp: Date.now() - 1 * 60 * 60 * 1000,
    actorId: 'admin1',
    actorName: 'Admin User',
    actorRole: 'admin',
    action: 'maintenance_updated',
    entity: 'maintenance',
    entityId: 'm1',
    description: 'Maintenance status updated for BUS-01',
    severity: 'info',
  },
  {
    id: 'al2',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    actorId: 'admin1',
    actorName: 'Admin User',
    actorRole: 'admin',
    action: 'broadcast_sent',
    entity: 'broadcast',
    entityId: 'b1',
    description: 'Emergency broadcast sent to Route A',
    severity: 'warning',
  },
  {
    id: 'al3',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    actorId: 'student1',
    actorName: 'Priya Sharma',
    actorRole: 'student',
    action: 'sos_triggered',
    entity: 'sos',
    entityId: 's1',
    description: 'Emergency SOS triggered from BUS-01',
    severity: 'critical',
  },
  {
    id: 'al4',
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    actorId: 'admin1',
    actorName: 'Admin User',
    actorRole: 'admin',
    action: 'sos_acknowledged',
    entity: 'sos',
    entityId: 's1',
    description: 'SOS alert acknowledged by admin',
    severity: 'success',
  },
  {
    id: 'al5',
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    actorId: 'admin1',
    actorName: 'Admin User',
    actorRole: 'admin',
    action: 'driver_assigned',
    entity: 'driver',
    entityId: 'd1',
    description: 'Driver Rajesh Kumar assigned to BUS-01',
    severity: 'info',
  },
];

// In-memory storage
let activityLogs: ActivityLog[] = [...INITIAL_LOGS];

class ActivityLogServiceImpl implements ActivityLogService {
  getAllLogs(limit: number = 50, offset: number = 0): ActivityLog[] {
    return [...activityLogs]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(offset, offset + limit);
  }

  getLogsByActor(actorId: string): ActivityLog[] {
    return activityLogs.filter(log => log.actorId === actorId)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getLogsByAction(action: ActionType): ActivityLog[] {
    return activityLogs.filter(log => log.action === action)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getLogsBySeverity(severity: Severity): ActivityLog[] {
    return activityLogs.filter(log => log.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getLogsByDateRange(startDate: Date, endDate: Date): ActivityLog[] {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    return activityLogs.filter(log => {
      const timestamp = log.timestamp;
      return timestamp >= start && timestamp <= end;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }

  addLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
    const newLog: ActivityLog = {
      ...log,
      id: `al${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    activityLogs.push(newLog);
    return newLog;
  }

  getSummary(): ActivityLogSummary {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCount = activityLogs.filter(log => log.timestamp >= today.getTime()).length;
    const thisWeekCount = activityLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const todayDate = new Date();
      const weekStart = new Date(todayDate);
      weekStart.setDate(todayDate.getDate() - 7);
      return log.timestamp >= weekStart.getTime();
    }).length;
    
    const bySeverity: Record<Severity, number> = {
      info: 0,
      warning: 0,
      error: 0,
      success: 0,
      critical: 0,
    };
    
    const byAction: Record<string, number> = {};
    const byActorRole: Record<string, number> = {};
    
    activityLogs.forEach(log => {
      bySeverity[log.severity]++;
      byAction[log.action] = (byAction[log.action] || 0) + 1;
      byActorRole[log.actorRole] = (byActorRole[log.actorRole] || 0) + 1;
    });
    
    return {
      total: activityLogs.length,
      bySeverity,
      byAction,
      byActorRole,
      todayCount,
      thisWeekCount,
    };
  }

  clearLogs(daysToKeep: number = 30): void {
    const cutoffDate = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
    activityLogs = activityLogs.filter(log => log.timestamp >= cutoffDate);
  }

  getSeverityColor(severity: Severity): string {
    return SEVERITY_COLORS[severity];
  }

  getSeverityIcon(severity: Severity): string {
    return SEVERITY_ICONS[severity];
  }
}

// Export singleton instance
let activityLogServiceInstance: ActivityLogService | null = null;

export const activityLogService = (() => {
  if (!activityLogServiceInstance) {
    activityLogServiceInstance = new ActivityLogServiceImpl();
  }
  return activityLogServiceInstance;
})();
