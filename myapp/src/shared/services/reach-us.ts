import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { ReachUsMessage } from './types';

export interface SubmitReachUsPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface UpdateReachUsPayload extends Partial<SubmitReachUsPayload> {
  status?: string;
}

class ReachUsService {
  async submit(payload: SubmitReachUsPayload): Promise<{ message: string; reachUs: ReachUsMessage }> {
    return apiService.post(API_ENDPOINTS.REACH_US.BASE, payload);
  }

  async list(): Promise<ReachUsMessage[]> {
    return apiService.get(API_ENDPOINTS.REACH_US.BASE);
  }

  async getById(id: string): Promise<ReachUsMessage> {
    return apiService.get(API_ENDPOINTS.REACH_US.BY_ID(id));
  }

  async update(id: string, payload: UpdateReachUsPayload): Promise<{ message: string; reachUs: ReachUsMessage }> {
    return apiService.put(API_ENDPOINTS.REACH_US.BY_ID(id), payload);
  }

  async remove(id: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.REACH_US.BY_ID(id));
  }
}

export const reachUsService = new ReachUsService();
