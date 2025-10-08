import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { FeedbackItem } from './types';

export interface SubmitFeedbackPayload {
  rating: number;
  subject?: string;
  message?: string;
  name?: string;
  email?: string;
}

export interface UpdateFeedbackPayload extends Partial<SubmitFeedbackPayload> {}

class FeedbackService {
  async submit(payload: SubmitFeedbackPayload): Promise<{ message: string; feedback: FeedbackItem }> {
    return apiService.post(API_ENDPOINTS.FEEDBACK.BASE, payload);
  }

  async list(): Promise<FeedbackItem[]> {
    return apiService.get(API_ENDPOINTS.FEEDBACK.ADMIN);
  }

  async getById(id: string): Promise<FeedbackItem> {
    return apiService.get(API_ENDPOINTS.FEEDBACK.BY_ID(id));
  }

  async update(id: string, payload: UpdateFeedbackPayload): Promise<{ message: string; feedback: FeedbackItem }> {
    return apiService.put(API_ENDPOINTS.FEEDBACK.BY_ID(id), payload);
  }

  async remove(id: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.FEEDBACK.BY_ID(id));
  }
}

export const feedbackService = new FeedbackService();
