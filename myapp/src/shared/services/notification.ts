import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { Notification } from './types';

class NotificationService {
  async list(): Promise<Notification[]> {
    return apiService.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
  }

  async markRead(notificationId: string): Promise<{ message: string; notification: Notification }> {
    return apiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
  }

  async markAllRead(): Promise<{ message: string }> {
    return apiService.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  }
}

export const notificationService = new NotificationService();
