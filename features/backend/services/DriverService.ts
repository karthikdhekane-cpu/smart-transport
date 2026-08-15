// Driver Service - Business logic for driver operations

import { DriverRepository } from '../repositories/DriverRepository';
import { Driver, DriverStatus } from '../types';

export class DriverService {
  private repository = new DriverRepository();
  private statusStore: Record<string, DriverStatus> = {};

  async getAllDrivers(): Promise<Driver[]> {
    return this.repository.getAll();
  }

  async getDriverById(id: string): Promise<Driver | null> {
    return this.repository.getById(id);
  }

  async getDriverByBus(busId: string): Promise<Driver | null> {
    return this.repository.getByBus(busId);
  }

  async setDriverStatus(driverId: string, status: 'driving' | 'idle' | 'break'): Promise<boolean> {
    this.statusStore[driverId] = {
      driverId,
      status,
      availability: this.statusStore[driverId]?.availability || 'available',
    };
    return true;
  }

  async setDriverAvailability(driverId: string, availability: 'available' | 'unavailable'): Promise<boolean> {
    const currentStatus = this.statusStore[driverId] || {
      driverId,
      status: 'idle',
      availability: 'available',
    };
    this.statusStore[driverId] = { ...currentStatus, availability };
    return true;
  }

  async getDriverStatus(driverId: string): Promise<DriverStatus | null> {
    return this.statusStore[driverId] || null;
  }

  async getAllDriverStatuses(): Promise<Record<string, DriverStatus>> {
    return this.statusStore;
  }
}
