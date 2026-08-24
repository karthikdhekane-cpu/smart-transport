// Maintenance Service
// Manages bus maintenance records

import type { 
  MaintenanceRecord, 
  MaintenanceService, 
  MaintenanceStatus, 
  MaintenanceType, 
  Priority,
  MaintenanceSummary 
} from '../types';

// Initial mock data
const INITIAL_DATA: MaintenanceRecord[] = [
  {
    id: 'm1',
    busId: 'BUS-01',
    busNumber: 'TN 38 AB 1234',
    maintenanceType: 'routine',
    priority: 'medium',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expectedCompletionDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'scheduled',
    notes: 'Scheduled routine maintenance',
    cost: 5000,
    technician: 'Ramesh',
    createdAt: Date.now() - 100000,
    updatedAt: Date.now() - 100000,
  },
  {
    id: 'm2',
    busId: 'BUS-02',
    busNumber: 'TN 38 CD 5678',
    maintenanceType: 'repair',
    priority: 'high',
    scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'in_progress',
    notes: 'Brake pad replacement in progress',
    cost: 8500,
    technician: 'Suresh',
    createdAt: Date.now() - 200000,
    updatedAt: Date.now() - 100000,
  },
  {
    id: 'm3',
    busId: 'BUS-03',
    busNumber: 'TN 38 EF 9012',
    maintenanceType: 'routine',
    priority: 'low',
    scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    actualCompletionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'completed',
    notes: 'Routine oil change and tire rotation',
    cost: 3500,
    technician: 'Ramesh',
    createdAt: Date.now() - 300000,
    updatedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
];

// In-memory storage
let maintenanceRecords: MaintenanceRecord[] = [...INITIAL_DATA];

class MaintenanceServiceImpl implements MaintenanceService {
  getAllMaintenance(): MaintenanceRecord[] {
    return [...maintenanceRecords].sort((a, b) => b.createdAt - a.createdAt);
  }

  getMaintenanceById(id: string): MaintenanceRecord | undefined {
    return maintenanceRecords.find(m => m.id === id);
  }

  getMaintenanceByBus(busId: string): MaintenanceRecord[] {
    return maintenanceRecords.filter(m => m.busId === busId)
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  }

  createMaintenance(record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>): MaintenanceRecord {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: `m${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    maintenanceRecords.push(newRecord);
    return newRecord;
  }

  updateMaintenance(id: string, updates: Partial<MaintenanceRecord>): MaintenanceRecord | undefined {
    const index = maintenanceRecords.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    
    const updatedRecord = {
      ...maintenanceRecords[index],
      ...updates,
      updatedAt: Date.now(),
    };
    maintenanceRecords[index] = updatedRecord;
    return updatedRecord;
  }

  updateStatus(id: string, status: MaintenanceStatus): MaintenanceRecord | undefined {
    const record = this.getMaintenanceById(id);
    if (!record) return undefined;
    
    return this.updateMaintenance(id, { status });
  }

  getSummary(): MaintenanceSummary {
    const scheduled = maintenanceRecords.filter(m => m.status === 'scheduled').length;
    const inProgress = maintenanceRecords.filter(m => m.status === 'in_progress').length;
    const completed = maintenanceRecords.filter(m => m.status === 'completed').length;
    const overdue = maintenanceRecords.filter(m => m.status === 'overdue').length;
    const critical = maintenanceRecords.filter(m => m.priority === 'critical').length;
    
    return {
      total: maintenanceRecords.length,
      scheduled,
      inProgress,
      completed,
      overdue,
      criticalCount: critical,
    };
  }

  getOverdueMaintenance(): MaintenanceRecord[] {
    const today = new Date().toISOString().split('T')[0];
    return maintenanceRecords.filter(m => {
      if (m.status === 'completed') return false;
      return m.scheduledDate < today;
    });
  }

  getUpcomingMaintenance(): MaintenanceRecord[] {
    const today = new Date().toISOString().split('T')[0];
    return maintenanceRecords.filter(m => {
      if (m.status === 'completed') return false;
      return m.scheduledDate >= today;
    }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  filterByStatus(status: MaintenanceStatus): MaintenanceRecord[] {
    return maintenanceRecords.filter(m => m.status === status);
  }

  filterByBus(busId: string): MaintenanceRecord[] {
    return maintenanceRecords.filter(m => m.busId === busId);
  }

  filterByPriority(priority: Priority): MaintenanceRecord[] {
    return maintenanceRecords.filter(m => m.priority === priority);
  }
}

// Export singleton instance
let maintenanceServiceInstance: MaintenanceService | null = null;

export const maintenanceService = (() => {
  if (!maintenanceServiceInstance) {
    maintenanceServiceInstance = new MaintenanceServiceImpl();
  }
  return maintenanceServiceInstance;
})();
