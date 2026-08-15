// Notification Repository - Manages notification data

import { BaseRepository } from './BaseRepository';
import { Notification } from '../types';

export class NotificationRepository extends BaseRepository<Notification> {
  constructor() { super('notifications'); }
  async getForUser(userId: string): Promise<Notification[]> {
    const notifications = await this.getAll();
    return notifications.filter(n => n.userId === userId);
  }
  async getUnreadForUser(userId: string): Promise<Notification[]> {
    const notifications = await this.getForUser(userId);
    return notifications.filter(n => !n.read);
  }
  async markAsRead(notificationId: string): Promise<boolean> {
    return this.update(notificationId, { read: true }) !== null;
  }
  async markAllAsRead(userId: string): Promise<number> {
    const notifications = await this.getForUser(userId);
    let count = 0;
    for (const notification of notifications) {
      if (!notification.read) {
        await this.update(notification.id, { read: true });
        count++;
      }
    }
    return count;
  }
}
