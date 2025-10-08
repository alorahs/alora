import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { FaqItem } from './types';

export interface CreateFaqPayload {
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateFaqPayload extends Partial<CreateFaqPayload> {}

class FaqService {
  async list(): Promise<FaqItem[]> {
    return apiService.get(API_ENDPOINTS.FAQ.BASE);
  }

  async create(payload: CreateFaqPayload): Promise<FaqItem> {
    return apiService.post(API_ENDPOINTS.FAQ.BASE, payload);
  }

  async update(id: string, payload: UpdateFaqPayload): Promise<FaqItem> {
    return apiService.put(API_ENDPOINTS.FAQ.BY_ID(id), payload);
  }

  async remove(id: string): Promise<{ message: string }> {
    return apiService.delete(API_ENDPOINTS.FAQ.BY_ID(id));
  }
}

export const faqService = new FaqService();
