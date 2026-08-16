// Vehicle Health Service
// Manages vehicle health status, maintenance tracking, and health alerts

import { VehicleHealth, FleetHealthSummary, HealthStatus } from '../types/index';
import { mockBuses } from '@/lib/mockData';

class VehicleHealthService {
  private vehicleHealth: Map<string, VehicleHealth> = new Map();

  constructor() {
    this.initializeVehicleHealth();
  }

  private initializeVehicleHealth() {
    // Initialize deterministic vehicle health data for each bus
    mockBuses.forEach((bus, index) => {
      const now = Date.now();
      const daysSinceService = (index * 15) % 60; // Varying service intervals
      
      const health: VehicleHealth = {
        busId: bus.id,
        overallStatus: this.calculateOverallStatus(index),
        engine: {
          status: this.getComponentStatus(index, 'engine'),
          temperature: 85 + (index * 2) % 15, // 85-100°C
          oilLevel: 70 + (index * 5) % 25, // 70-95%
          lastService: now - (daysSinceService * 24 * 60 * 60 * 1000),
          nextService: now + ((60 - daysSinceService) * 24 * 60 * 60 * 1000),
        },
        battery: {
          status: this.getComponentStatus(index, 'battery'),
          level: 75 + (index * 3) % 20, // 75-95%
          voltage: 12.4 + (index * 0.1) % 0.8, // 12.4-13.2V
          lastReplacement: now - (180 + index * 30) * 24 * 60 * 60 * 1000,
        },
        tires: {
          status: this.getComponentStatus(index, 'tires'),
          pressure: 30 + (index * 2) % 5, // 30-35 PSI
          treadDepth: 6 - (index * 0.3) % 2, // 4-6mm
          lastRotation: now - (45 + index * 10) * 24 * 60 * 60 * 1000,
        },
        brakes: {
          status: this.getComponentStatus(index, 'brakes'),
          padWear: 20 + (index * 10) % 40, // 20-60% worn
          fluidLevel: 80 + (index * 5) % 15, // 80-95%
          lastInspection: now - (30 + index * 15) * 24 * 60 * 60 * 1000,
        },
        lastInspection: now - (30 + index * 10) * 24 * 60 * 60 * 1000,
        nextInspection: now + (90 - (index * 10)) * 24 * 60 * 60 * 1000,
        mileage: 50000 + (index * 10000) + Math.floor(Math.random() * 5000),
        criticalWarnings: this.generateCriticalWarnings(index),
      };

      this.vehicleHealth.set(bus.id, health);
    });
  }

  private calculateOverallStatus(index: number): HealthStatus {
    // Deterministic status based on index
    if (index === 3) return 'critical'; // BUS-04 has issues
    if (index === 1) return 'maintenance_due'; // BUS-02 needs maintenance
    if (index === 2) return 'attention_required'; // BUS-03 needs attention
    return 'healthy'; // BUS-01 is healthy
  }

  private getComponentStatus(index: number, component: string): HealthStatus {
    // Deterministic component status
    const statusMap: Record<number, HealthStatus> = {
      0: 'healthy',
      1: 'maintenance_due',
      2: 'attention_required',
      3: 'critical',
    };
    return statusMap[index % 4] || 'healthy';
  }

  private generateCriticalWarnings(index: number): string[] {
    const warnings: string[] = [];
    
    if (index === 3) {
      warnings.push('Brake pad wear critical');
      warnings.push('Engine temperature high');
    }
    
    if (index === 1) {
      warnings.push('Oil change due');
      warnings.push('Tire rotation required');
    }
    
    if (index === 2) {
      warnings.push('Battery voltage low');
    }
    
    return warnings;
  }

  // Get vehicle health for a specific bus
  getVehicleHealth(busId: string): VehicleHealth | null {
    return this.vehicleHealth.get(busId) || null;
  }

  // Get fleet health summary
  getFleetHealthSummary(): FleetHealthSummary {
    const vehicles = Array.from(this.vehicleHealth.values());
    
    const summary: FleetHealthSummary = {
      totalVehicles: vehicles.length,
      healthy: vehicles.filter(v => v.overallStatus === 'healthy').length,
      attentionRequired: vehicles.filter(v => v.overallStatus === 'attention_required').length,
      maintenanceDue: vehicles.filter(v => v.overallStatus === 'maintenance_due').length,
      critical: vehicles.filter(v => v.overallStatus === 'critical').length,
      vehicles,
    };

    return summary;
  }

  // Get vehicles requiring attention
  getVehiclesRequiringAttention(): VehicleHealth[] {
    return Array.from(this.vehicleHealth.values()).filter(
      v => v.overallStatus !== 'healthy'
    );
  }

  // Get vehicles with critical status
  getCriticalVehicles(): VehicleHealth[] {
    return Array.from(this.vehicleHealth.values()).filter(
      v => v.overallStatus === 'critical'
    );
  }

  // Check if service is due for a vehicle
  isServiceDue(busId: string): boolean {
    const health = this.vehicleHealth.get(busId);
    if (!health) return false;
    
    const now = Date.now();
    return health.engine.nextService <= now;
  }

  // Get upcoming services
  getUpcomingServices(days: number = 30): Array<{ busId: string; busNumber: string; dueDate: number; daysUntil: number }> {
    const now = Date.now();
    const cutoff = now + (days * 24 * 60 * 60 * 1000);
    
    return Array.from(this.vehicleHealth.values())
      .filter(v => v.engine.nextService <= cutoff && v.engine.nextService > now)
      .map(v => {
        const bus = mockBuses.find(b => b.id === v.busId);
        return {
          busId: v.busId,
          busNumber: bus?.number || v.busId,
          dueDate: v.engine.nextService,
          daysUntil: Math.ceil((v.engine.nextService - now) / (24 * 60 * 60 * 1000)),
        };
      })
      .sort((a, b) => a.dueDate - b.dueDate);
  }

  // Get all critical warnings across fleet
  getAllCriticalWarnings(): Array<{ busId: string; busNumber: string; warning: string }> {
    const warnings: Array<{ busId: string; busNumber: string; warning: string }> = [];
    
    this.vehicleHealth.forEach((health, busId) => {
      const bus = mockBuses.find(b => b.id === busId);
      health.criticalWarnings.forEach(warning => {
        warnings.push({
          busId,
          busNumber: bus?.number || busId,
          warning,
        });
      });
    });
    
    return warnings;
  }

  // Update vehicle health (for simulation or real updates)
  updateVehicleHealth(busId: string, updates: Partial<VehicleHealth>): boolean {
    const existing = this.vehicleHealth.get(busId);
    if (!existing) return false;
    
    const updated = { ...existing, ...updates };
    this.vehicleHealth.set(busId, updated);
    return true;
  }
}

export const vehicleHealthService = new VehicleHealthService();
