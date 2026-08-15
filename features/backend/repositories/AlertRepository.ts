// Alert Repository - Manages alert data

import { BaseRepository } from './BaseRepository';
import { Alert } from '../types';

export class AlertRepository extends BaseRepository<Alert> {
  constructor() { super('alerts'); }
  async getForBus(busId: string): Promise<Alert[]> {
    const alerts = await this.getAll();
    return alerts.filter(a => a.busId === busId);
  }
  async getUnresolvedForBus(busId: string): Promise<Alert[]> {
    const alerts = await this.getAll();
    return alerts.filter(a => a.busId === busId && !a.resolved);
  }
  async resolve(alertId: string): Promise<boolean> {
    return this.update(alertId, { resolved: true }) !== null;
  }
}
