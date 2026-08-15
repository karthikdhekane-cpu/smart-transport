import { BaseRepository } from './BaseRepository';
import { GPSLocation } from '../types';

export class GPSRepository extends BaseRepository<GPSLocation> {
  constructor() { super('gpsLocations'); }
  async getCurrentForBus(busId: string): Promise<GPSLocation | null> {
    const locations = await this.getAll();
    const filtered = locations.filter(l => l.busId === busId);
    if (filtered.length === 0) return null;
    return filtered.sort((a, b) => b.timestamp - a.timestamp)[0];
  }
  async saveLocation(busId: string, lat: number, lng: number, speed: number): Promise<GPSLocation> {
    return this.create({ busId, lat, lng, speed, timestamp: Date.now() });
  }
}
