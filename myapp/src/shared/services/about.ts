import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { AboutUsContent } from './types';

export interface UpdateAboutUsPayload extends Partial<AboutUsContent> {}

class AboutService {
  async get(): Promise<AboutUsContent> {
    return apiService.get(API_ENDPOINTS.ABOUT_US.BASE);
  }

  async update(payload: UpdateAboutUsPayload): Promise<{ message: string; about: AboutUsContent }> {
    return apiService.put(API_ENDPOINTS.ABOUT_US.BASE, payload);
  }
}

export const aboutService = new AboutService();
