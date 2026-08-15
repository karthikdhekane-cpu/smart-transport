// Route Repository - Manages route data

import { BaseRepository } from './BaseRepository';
import { Route } from '../types';

export class RouteRepository extends BaseRepository<Route> {
  constructor() { super('routes'); }
  async getByBus(busId: string): Promise<Route | null> {
    const routes = await this.getAll();
    return routes.find(r => r.busId === busId) || null;
  }
}
