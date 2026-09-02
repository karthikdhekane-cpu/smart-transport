// BaseRepository with Firebase Firestore support
// Server-side only - uses Firebase Admin SDK

import { adminFirestore } from '@/lib/firebase-admin';
import { IRepository, BaseEntity } from '../types';

export class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async getAll(): Promise<T[]> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return [];
    }
    
    try {
      const querySnapshot = await adminFirestore.collection(this.collectionName).get();
      return querySnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      } as T));
    } catch (error) {
      console.error(`Error getting all ${this.collectionName}:`, error);
      return [];
    }
  }

  async getById(id: string): Promise<T | null> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return null;
    }
    
    try {
      const docSnap = await adminFirestore.collection(this.collectionName).doc(id).get();
      if (docSnap.exists) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by id ${id}:`, error);
      return null;
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    if (!adminFirestore) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    
    try {
      const id = adminFirestore.collection(this.collectionName).doc().id;
      const now = Date.now();
      const documentData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      
      await adminFirestore.collection(this.collectionName).doc(id).set(documentData);
      return {
        ...documentData,
        id,
      } as T;
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw new Error(`Failed to create ${this.collectionName}`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return null;
    }
    
    try {
      // Get existing document
      const existingDoc = await adminFirestore.collection(this.collectionName).doc(id).get();
      if (!existingDoc.exists) {
        return null;
      }
      
      // Prepare update data
      const updateData: any = { ...data };
      if (updateData.createdAt !== undefined) {
        delete updateData.createdAt;
      }
      updateData.updatedAt = Date.now();
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      
      // Update document
      await adminFirestore.collection(this.collectionName).doc(id).update(updateData);
      
      // Return updated document
      const updatedDoc = await adminFirestore.collection(this.collectionName).doc(id).get();
      if (updatedDoc.exists) {
        return {
          ...updatedDoc.data(),
          id: updatedDoc.id,
        } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error updating ${this.collectionName} with id ${id}:`, error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return false;
    }
    
    try {
      await adminFirestore.collection(this.collectionName).doc(id).delete();
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.collectionName} with id ${id}:`, error);
      return false;
    }
  }

  async findByField(fieldName: keyof T, fieldValue: any): Promise<T[]> {
    if (!adminFirestore) {
      console.warn('Firebase Admin SDK not initialized');
      return [];
    }
    
    try {
      const querySnapshot = await adminFirestore.collection(this.collectionName)
        .where(String(fieldName), '==', fieldValue)
        .get();
      return querySnapshot.docs.map((doc: any) => ({
        ...doc.data(),
        id: doc.id,
      } as T));
    } catch (error) {
      console.error(`Error finding ${this.collectionName} by ${String(fieldName)}:`, error);
      return [];
    }
  }
}
