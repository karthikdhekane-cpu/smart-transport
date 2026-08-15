// Bus Repository - Manages bus data

import { BaseRepository } from './BaseRepository';
import { Bus } from '../types';

export class BusRepository extends BaseRepository<Bus> {
  constructor() { super('buses'); }
  async getByRoute(routeId: string): Promise<Bus[]> {
    const buses = await this.getAll();
    return buses.filter(b => b.routeId === routeId);
  }
  async updateStatus(busId: string, status: Bus['status']): Promise<Bus | null> {
    return this.update(busId, { status });
  }
  async updateOccupancy(busId: string, occupancy: number): Promise<Bus | null> {
    return this.update(busId, { occupancy });
  }
}
