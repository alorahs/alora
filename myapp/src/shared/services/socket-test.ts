import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';

export interface BroadcastPayload {
  title: string;
  message: string;
  type?: string;
}

export interface DirectNotificationPayload extends BroadcastPayload {}

class SocketTestService {
  async broadcast(payload: BroadcastPayload): Promise<{ message: string }> {
    return apiService.post(API_ENDPOINTS.SOCKET_TEST.BROADCAST, payload);
  }

  async sendToUser(userId: string, payload: DirectNotificationPayload): Promise<{ message: string }> {
    return apiService.post(API_ENDPOINTS.SOCKET_TEST.SEND(userId), payload);
  }

  async getStats(): Promise<{ connections: number; rooms: number; users: number }> {
    return apiService.get(API_ENDPOINTS.SOCKET_TEST.STATS);
  }
}

export const socketTestService = new SocketTestService();
