// GPS Service - Business logic for GPS operations

import { GPSRepository } from '../repositories/GPSRepository';
import { GPSLocation } from '../types';

export class GPSService {
  private repository = new GPSRepository();

  async getCurrentLocation(busId: string): Promise<GPSLocation | null> {
    return this.repository.getCurrentForBus(busId);
  }

  async getRecentLocations(busId: string, minutes: number = 15): Promise<GPSLocation[]> {
    const locations = await this.repository.getAll();
    const now = Date.now();
    const cutoff = now - minutes * 60 * 1000;
    return locations.filter(l => l.busId === busId && l.timestamp >= cutoff);
  }

  async getLatestLocations(): Promise<Record<string, GPSLocation>> {
    const locations = await this.repository.getAll();
    const latest: Record<string, GPSLocation> = {};
    for (const location of locations) {
      if (!latest[location.busId] || location.timestamp > latest[location.busId].timestamp) {
        latest[location.busId] = location;
      }
    }
    return latest;
  }

  async saveLocation(
    busId: string,
    lat: number,
    lng: number,
    speed: number,
    heading?: number
  ): Promise<void> {
    await this.repository.saveLocation(busId, lat, lng, speed);
  }

  async getLocationsForTrip(tripId: string): Promise<GPSLocation[]> {
    const locations = await this.repository.getAll();
    return locations.filter(l => l.busId === tripId);
  }
}
