// User Repository - Manages user data

import { BaseRepository } from './BaseRepository';
import { User } from '../types';

export class UserRepository extends BaseRepository<User> {
  constructor() { super('users'); }
  async getByEmail(email: string): Promise<User | null> {
    const users = await this.getAll();
    return users.find(u => u.email === email) || null;
  }
}
