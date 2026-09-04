// Bus Repository - Manages bus data

import { adminFirestore } from '@/lib/firebase-admin';
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

  // Bus type doesn't have driverId field - relationship is via Driver.busId
  async assignDriverToBus(busId: string, driverId: string | null): Promise<boolean> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return false;
    }

    try {
      // Get current driver for this bus
      const drivers = await this.getAllDrivers();
      const currentDriver = drivers.find(d => d.busId === busId);

      const batch = adminFirestore.batch();

      // Clear old driver's busId
      if (currentDriver) {
        batch.update(
          adminFirestore.collection('drivers').doc(currentDriver.id),
          { busId: null, updatedAt: Date.now() }
        );
      }

      // Set new driver's busId
      if (driverId) {
        const driverRef = adminFirestore.collection('drivers').doc(driverId);
        batch.update(driverRef, { busId, updatedAt: Date.now() });
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error(`Error assigning driver to bus ${busId}:`, error);
      return false;
    }
  }

  async assignRoute(busId: string, routeId: string | null): Promise<boolean> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return false;
    }

    try {
      const busRef = adminFirestore.collection('buses').doc(busId);
      const busSnap = await busRef.get();

      if (!busSnap.exists) {
        return false;
      }

      const currentRouteId = busSnap.data()?.routeId;

      const batch = adminFirestore.batch();

      batch.update(busRef, { routeId, updatedAt: Date.now() });

      if (currentRouteId) {
        const oldRouteRef = adminFirestore.collection('routes').doc(currentRouteId);
        batch.update(oldRouteRef, { busId: null, updatedAt: Date.now() });
      }

      if (routeId) {
        const newRouteRef = adminFirestore.collection('routes').doc(routeId);
        batch.update(newRouteRef, { busId, updatedAt: Date.now() });
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error(`Error assigning route to bus ${busId}:`, error);
      return false;
    }
  }

  private async getAllDrivers(): Promise<any[]> {
    if (!adminFirestore) {
      return [];
    }
    try {
      const snapshot = await adminFirestore.collection('drivers').get();
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return [];
    }
  }
}
