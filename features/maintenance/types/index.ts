// Maintenance Types

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';
export type MaintenanceType = 'routine' | 'repair' | 'inspection' | 'emergency';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface MaintenanceRecord {
  id: string;
  busId: string;
  busNumber: string;
  maintenanceType: MaintenanceType;
  priority: Priority;
  scheduledDate: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  status: MaintenanceStatus;
  notes?: string;
  cost?: number;
  technician?: string;
  createdAt: number;
  updatedAt: number;
  completedBy?: string;
}

export interface MaintenanceSummary {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  overdue: number;
  criticalCount: number;
}

export interface MaintenanceService {
  getAllMaintenance(): MaintenanceRecord[];
  getMaintenanceById(id: string): MaintenanceRecord | undefined;
  getMaintenanceByBus(busId: string): MaintenanceRecord[];
  createMaintenance(record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>): MaintenanceRecord;
  updateMaintenance(id: string, updates: Partial<MaintenanceRecord>): MaintenanceRecord | undefined;
  updateStatus(id: string, status: MaintenanceStatus): MaintenanceRecord | undefined;
  getSummary(): MaintenanceSummary;
  getOverdueMaintenance(): MaintenanceRecord[];
  getUpcomingMaintenance(): MaintenanceRecord[];
  filterByStatus(status: MaintenanceStatus): MaintenanceRecord[];
  filterByBus(busId: string): MaintenanceRecord[];
  filterByPriority(priority: Priority): MaintenanceRecord[];
}
