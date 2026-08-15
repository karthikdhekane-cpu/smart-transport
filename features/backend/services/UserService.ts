// User Service - Business logic for user operations

import { UserRepository } from '../repositories/UserRepository';
import { User, UserRole } from '../types';

export class UserService {
  private repository = new UserRepository();

  async getAllUsers(): Promise<User[]> {
    return this.repository.getAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repository.getById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.repository.getByEmail(email);
  }

  async createAdmin(email: string, name: string): Promise<User> {
    return this.repository.create({ email, role: 'admin' as UserRole, name, phone: '+91 98765 43210' });
  }

  async createDriver(email: string, name: string, phone: string): Promise<User> {
    return this.repository.create({ email, role: 'driver' as UserRole, name, phone });
  }

  async createParent(email: string, name: string, phone: string): Promise<User> {
    return this.repository.create({ email, role: 'parent' as UserRole, name, phone });
  }

  async createStudent(email: string, name: string): Promise<User> {
    return this.repository.create({ email, role: 'student' as UserRole, name });
  }
}
