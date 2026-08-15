import { IRepository, BaseEntity } from '../types';

const storage: Record<string, any[]> = {};

export class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    if (!storage[storageKey]) storage[storageKey] = [];
  }

  async getAll(): Promise<T[]> { return storage[this.storageKey] || []; }
  
  async getById(id: string): Promise<T | null> {
    const items = await this.getAll();
    return items.find(item => item.id === id) || null;
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const item = { ...data, id, createdAt: now, updatedAt: now } as T;
    storage[this.storageKey].push(item);
    return item;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    const updated = { ...items[index], ...data, updatedAt: Date.now() } as T;
    storage[this.storageKey][index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;
    storage[this.storageKey].splice(index, 1);
    return true;
  }
}
