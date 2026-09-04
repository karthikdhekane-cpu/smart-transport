// Driver Repository - Manages driver data

import { adminFirestore } from '@/lib/firebase-admin';
import { BaseRepository } from './BaseRepository';
import { Driver } from '../types';

export class DriverRepository extends BaseRepository<Driver> {
  constructor() { super('drivers'); }

  async getByBus(busId: string): Promise<Driver | null> {
    const drivers = await this.getAll();
    return drivers.find(d => d.busId === busId) || null;
  }

  async assignToBus(driverId: string, busId: string): Promise<boolean> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return false;
    }

    try {
      const driverRef = adminFirestore.collection('drivers').doc(driverId);
      const busRef = adminFirestore.collection('buses').doc(busId);
      
      const driverSnap = await driverRef.get();
      const busSnap = await busRef.get();
      
      if (!driverSnap.exists || !busSnap.exists) {
        return false;
      }

      const batch = adminFirestore.batch();
      const driverData = driverSnap.data();
      const previousBusId = driverData?.busId;
      
      batch.update(driverRef, { busId, updatedAt: Date.now() });

      if (previousBusId) {
        const oldBusRef = adminFirestore.collection('buses').doc(previousBusId);
        const oldBusSnap = await oldBusRef.get();
        if (oldBusSnap.exists) {
          batch.update(oldBusRef, { driverId: null, updatedAt: Date.now() });
        }
      }

      batch.update(busRef, { driverId, updatedAt: Date.now() });
      await batch.commit();
      return true;
    } catch (error) {
      console.error(`Error assigning driver ${driverId} to bus ${busId}:`, error);
      return false;
    }
  }

  async clearBusAssignment(driverId: string): Promise<boolean> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return false;
    }

    try {
      const driverRef = adminFirestore.collection('drivers').doc(driverId);
      const driverSnap = await driverRef.get();
      
      if (!driverSnap.exists) {
        return false;
      }

      const driverData = driverSnap.data();
      const previousBusId = driverData?.busId;

      if (!previousBusId) {
        return true;
      }

      const batch = adminFirestore.batch();
      batch.update(driverRef, { busId: null, updatedAt: Date.now() });
      
      const busRef = adminFirestore.collection('buses').doc(previousBusId);
      batch.update(busRef, { driverId: null, updatedAt: Date.now() });
      
      await batch.commit();
      return true;
    } catch (error) {
      console.error(`Error clearing bus assignment for driver ${driverId}:`, error);
      return false;
    }
  }
}
