// Activity Log Types

export type Severity = 'info' | 'warning' | 'error' | 'success' | 'critical';
export type ActionType = 
  | 'user_created' 
  | 'user_updated' 
  | 'user_deleted'
  | 'bus_created'
  | 'bus_updated'
  | 'bus_deleted'
  | 'driver_assigned'
  | 'bus_assigned'
  | 'route_changed'
  | 'maintenance_updated'
  | 'broadcast_sent'
  | 'sos_triggered'
  | 'sos_acknowledged'
  | 'sos_resolved'
  | 'attendance_changed'
  | 'configuration_changed';

export interface ActivityLog {
  id: string;
  timestamp: number;
  actorId: string;
  actorName: string;
  actorRole: 'admin' | 'driver' | 'student' | 'parent';
  action: ActionType;
  entity: string;           // Resource type
  entityId?: string;        // Resource ID
  description: string;
  severity: Severity;
  metadata?: Record<string, any>;
}

export interface ActivityLogSummary {
  total: number;
  bySeverity: Record<Severity, number>;
  byAction: Record<ActionType, number>;
  byActorRole: Record<string, number>;
  todayCount: number;
  thisWeekCount: number;
}

export interface ActivityLogService {
  getAllLogs(limit?: number, offset?: number): ActivityLog[];
  getLogsByActor(actorId: string): ActivityLog[];
  getLogsByAction(action: ActionType): ActivityLog[];
  getLogsBySeverity(severity: Severity): ActivityLog[];
  getLogsByDateRange(startDate: Date, endDate: Date): ActivityLog[];
  addLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog;
  getSummary(): ActivityLogSummary;
  clearLogs(daysToKeep?: number): void;
}
