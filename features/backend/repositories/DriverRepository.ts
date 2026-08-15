// Driver Repository - Manages driver data

import { BaseRepository } from './BaseRepository';
import { Driver } from '../types';

export class DriverRepository extends BaseRepository<Driver> {
  constructor() { super('drivers'); }
  async getByBus(busId: string): Promise<Driver | null> {
    const drivers = await this.getAll();
    return drivers.find(d => d.busId === busId) || null;
  }
}
