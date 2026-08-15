// Trip Repository - Manages trip data

import { BaseRepository } from './BaseRepository';
import { Trip } from '../types';

export class TripRepository extends BaseRepository<Trip> {
  constructor() { super('trips'); }
  async getActiveForBus(busId: string): Promise<Trip | null> {
    const trips = await this.getAll();
    return trips.find(t => t.busId === busId && t.status === 'active') || null;
  }
  async getForBus(busId: string): Promise<Trip[]> {
    const trips = await this.getAll();
    return trips.filter(t => t.busId === busId).sort((a, b) => b.createdAt - a.createdAt);
  }
  async startTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
    const existingActive = await this.getActiveForBus(tripData.busId);
    if (existingActive) throw new Error('Bus already has an active trip');
    return this.create(tripData);
  }
  async completeTrip(tripId: string): Promise<Trip | null> {
    return this.update(tripId, { status: 'completed', endTime: Date.now() } as Partial<Trip>);
  }
}
