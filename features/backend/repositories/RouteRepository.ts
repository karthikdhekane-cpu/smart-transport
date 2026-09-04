// Route Repository - Manages route data

import { adminFirestore } from '@/lib/firebase-admin';
import { BaseRepository } from './BaseRepository';
import { Route } from '../types';

export class RouteRepository extends BaseRepository<Route> {
  constructor() { super('routes'); }

  async getByBus(busId: string): Promise<Route | null> {
    const routes = await this.getAll();
    return routes.find(r => r.busId === busId) || null;
  }

  async assignBus(routeId: string, busId: string | null): Promise<boolean> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return false;
    }

    try {
      const routeRef = adminFirestore.collection('routes').doc(routeId);
      const routeSnap = await routeRef.get();

      if (!routeSnap.exists) {
        return false;
      }

      const currentBusId = routeSnap.data()?.busId;

      const batch = adminFirestore.batch();

      batch.update(routeRef, { busId, updatedAt: Date.now() });

      if (currentBusId) {
        const oldBusRef = adminFirestore.collection('buses').doc(currentBusId);
        batch.update(oldBusRef, { routeId: null, updatedAt: Date.now() });
      }

      if (busId) {
        const newBusRef = adminFirestore.collection('buses').doc(busId);
        batch.update(newBusRef, { routeId, updatedAt: Date.now() });
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error(`Error assigning bus to route ${routeId}:`, error);
      return false;
    }
  }
}
