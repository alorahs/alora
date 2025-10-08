import { apiService } from './api';
import { API_ENDPOINTS } from '@/shared/constants';
import type { ServiceItem } from './types';

export interface CreateServicePayload extends Omit<ServiceItem, '_id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateServicePayload extends Partial<CreateServicePayload> {}

class ServiceService {
  async list(): Promise<ServiceItem[]> {
    return apiService.get<ServiceItem[]>(API_ENDPOINTS.SERVICES.BASE);
  }

  async getById(id: string): Promise<ServiceItem> {
    return apiService.get<ServiceItem>(API_ENDPOINTS.SERVICES.BY_ID(id));
  }

  async create(payload: CreateServicePayload): Promise<ServiceItem> {
    return apiService.post<ServiceItem>(API_ENDPOINTS.SERVICES.BASE, payload);
  }

  async createBulk(payload: CreateServicePayload[]): Promise<ServiceItem[]> {
    return apiService.post<ServiceItem[]>(API_ENDPOINTS.SERVICES.BULK, payload);
  }

  async update(id: string, payload: UpdateServicePayload): Promise<ServiceItem> {
    return apiService.put<ServiceItem>(API_ENDPOINTS.SERVICES.BY_ID(id), payload);
  }

  async remove(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(API_ENDPOINTS.SERVICES.BY_ID(id));
  }
}

export const serviceService = new ServiceService();
