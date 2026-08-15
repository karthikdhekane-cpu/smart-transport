// Authentication Service - Handles user authentication

import { User, UserRole, AuthState } from '../types';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  private userRepository = new UserRepository();
  private currentUser: User | null = null;
  private loading = false;
  private error: string | null = null;

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    this.loading = true;
    try {
      const mockUsers = [
        { email: 'admin@campbus.com', password: 'admin123', role: 'admin' as UserRole },
        { email: 'driver@campbus.com', password: 'driver123', role: 'driver' as UserRole },
        { email: 'parent@campbus.com', password: 'parent123', role: 'parent' as UserRole },
        { email: 'student@campbus.com', password: 'student123', role: 'student' as UserRole },
      ];

      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        this.error = 'User not found';
        this.loading = false;
        return { success: false, error: 'User not found' };
      }
      if (password !== 'demo123') {
        this.error = 'Invalid password';
        this.loading = false;
        return { success: false, error: 'Invalid password' };
      }

      let dbUser = await this.userRepository.getByEmail(email);
      if (!dbUser) {
        dbUser = await this.userRepository.create({
          email,
          role: user.role,
          name: email.split('@')[0],
          phone: '+91 98765 43210',
        });
      }
      this.currentUser = dbUser;
      this.error = null;
      this.loading = false;
      return { success: true, user: dbUser };
    } catch (err) {
      this.error = (err as Error).message;
      this.loading = false;
      return { success: false, error: (err as Error).message };
    }
  }

  getCurrentUser(): User | null { return this.currentUser; }
  isUserAdmin(): boolean { return this.currentUser?.role === 'admin'; }
  isUserDriver(): boolean { return this.currentUser?.role === 'driver'; }
  isUserParent(): boolean { return this.currentUser?.role === 'parent'; }
  isUserStudent(): boolean { return this.currentUser?.role === 'student'; }
  getUserRole(): UserRole | null { return this.currentUser?.role || null; }
  isLoading(): boolean { return this.loading; }
  getError(): string | null { return this.error; }
}

export const authService = new AuthService();
